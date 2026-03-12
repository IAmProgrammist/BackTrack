"""
Binary Autoencoder  —  262144 → 2048 → 262144
==============================================
Modes
-----
  train    Scan a directory (recursive) for .bin files (exactly 262144 bits = 32768 bytes),
           train the autoencoder, save the model to a .pt file.

  predict  Load a saved .pt model, compress a .bin file to a .latent file,
           then decompress back and save the reconstruction as a .bin file.

Usage examples
--------------
  python binary_autoencoder.py train  --data_dir ./dataset --model_out model.pt
  python binary_autoencoder.py train  --data_dir ./dataset --model_out model.pt --epochs 20 --batch_size 16 --lr 1e-3

  python binary_autoencoder.py predict --model model.pt --input file.bin --out_dir ./results
"""

import argparse
import os
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset

# ─────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────
INPUT_DIM   = 262_144          # bits  (= 32 768 bytes)
LATENT_DIM  =   2_048          # float32 values
HIDDEN_DIMS = [65_536, 16_384, 4_096]
FILE_BYTES  = INPUT_DIM // 8   # 32 768 bytes


# ─────────────────────────────────────────────────────────────────
# Device selection  (CUDA → MPS/Metal → CPU)
# ─────────────────────────────────────────────────────────────────
def get_device() -> str:
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


# ─────────────────────────────────────────────────────────────────
# Model
# ─────────────────────────────────────────────────────────────────
class BinaryAutoencoder(nn.Module):
    def __init__(
        self,
        input_dim:   int  = INPUT_DIM,
        latent_dim:  int  = LATENT_DIM,
        hidden_dims: list = None,
        dropout:     float = 0.1,
    ):
        super().__init__()
        if hidden_dims is None:
            hidden_dims = HIDDEN_DIMS

        # Encoder
        enc, prev = [], input_dim
        for h in hidden_dims:
            enc += [nn.Linear(prev, h), nn.BatchNorm1d(h),
                    nn.LeakyReLU(0.2), nn.Dropout(dropout)]
            prev = h
        enc.append(nn.Linear(prev, latent_dim))
        self.encoder = nn.Sequential(*enc)

        # Decoder
        dec, prev = [], latent_dim
        for h in reversed(hidden_dims):
            dec += [nn.Linear(prev, h), nn.BatchNorm1d(h),
                    nn.LeakyReLU(0.2), nn.Dropout(dropout)]
            prev = h
        dec += [nn.Linear(prev, input_dim), nn.Sigmoid()]
        self.decoder = nn.Sequential(*dec)

    def encode(self, x):  return self.encoder(x)
    def decode(self, z):  return self.decoder(z)
    def forward(self, x):
        z = self.encode(x)
        return self.decode(z), z

    @staticmethod
    def binarize(soft, threshold=0.5):
        return (soft >= threshold).float()


# ─────────────────────────────────────────────────────────────────
# Loss
# ─────────────────────────────────────────────────────────────────
class AutoencoderLoss(nn.Module):
    def __init__(self, latent_weight=1e-4):
        super().__init__()
        self.bce = nn.BCELoss()
        self.lw  = latent_weight

    def forward(self, x_hat, x, z):
        recon = self.bce(x_hat, x)
        spars = self.lw * z.abs().mean()
        return recon + spars, recon


# ─────────────────────────────────────────────────────────────────
# Dataset  —  loads .bin files from directory tree
# ─────────────────────────────────────────────────────────────────
class BinFileDataset(Dataset):
    def __init__(self, root_dir: str):
        root = Path(root_dir)
        all_files = sorted(root.rglob("*.bin"))
        if not all_files:
            raise FileNotFoundError(f"No .bin files found under: {root_dir}")

        # Filter to exact size
        valid   = [f for f in all_files if f.stat().st_size == FILE_BYTES]
        skipped = len(all_files) - len(valid)
        if skipped:
            print(f"  [!] Skipped {skipped} file(s) with wrong size "
                  f"(expected {FILE_BYTES} bytes = {INPUT_DIM} bits each)")
        self.files = valid
        if not self.files:
            raise ValueError(
                f"No valid .bin files of {FILE_BYTES} bytes found under: {root_dir}"
            )
        print(f"  Found {len(self.files)} valid .bin file(s) in '{root_dir}'")

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        raw  = self.files[idx].read_bytes()              # 32 768 bytes
        bits = np.unpackbits(
            np.frombuffer(raw, dtype=np.uint8)
        ).astype(np.float32)
        return torch.from_numpy(bits)                    # (262144,)


# ─────────────────────────────────────────────────────────────────
# Bit I/O helpers
# ─────────────────────────────────────────────────────────────────
def load_bin_file(path: str) -> torch.Tensor:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Input file not found: {path}")
    if p.stat().st_size != FILE_BYTES:
        raise ValueError(
            f"Expected {FILE_BYTES} bytes ({INPUT_DIM} bits), "
            f"got {p.stat().st_size} bytes: {path}"
        )
    raw  = np.frombuffer(p.read_bytes(), dtype=np.uint8)
    bits = np.unpackbits(raw).astype(np.float32)
    return torch.from_numpy(bits)


def save_bin_file(bits_tensor: torch.Tensor, path: str):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    arr    = bits_tensor.cpu().numpy().astype(np.uint8)
    packed = np.packbits(arr)
    Path(path).write_bytes(packed.tobytes())


def save_latent(z: torch.Tensor, path: str):
    """Save latent vector (2048,) as raw float16 bytes (.latent)."""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    arr = z.cpu().float().numpy().astype(np.float16)
    Path(path).write_bytes(arr.tobytes())


def bit_accuracy(x_hat_soft: torch.Tensor, x: torch.Tensor) -> float:
    return BinaryAutoencoder.binarize(x_hat_soft).eq(x).float().mean().item()


# ─────────────────────────────────────────────────────────────────
# Checkpoint helpers
# ─────────────────────────────────────────────────────────────────
def save_model(model, path, meta=None):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    torch.save({
        "model_state_dict": model.state_dict(),
        "input_dim":        INPUT_DIM,
        "latent_dim":       LATENT_DIM,
        "hidden_dims":      HIDDEN_DIMS,
        **(meta or {}),
    }, path)
    print(f"  Model saved → {path}")


def load_model(path, device="cpu") -> BinaryAutoencoder:
    ckpt  = torch.load(path, map_location=device, weights_only=False)
    model = BinaryAutoencoder(
        input_dim   = ckpt.get("input_dim",   INPUT_DIM),
        latent_dim  = ckpt.get("latent_dim",  LATENT_DIM),
        hidden_dims = ckpt.get("hidden_dims", HIDDEN_DIMS),
    )
    model.load_state_dict(ckpt["model_state_dict"])
    model.to(device)
    model.eval()
    return model


# ─────────────────────────────────────────────────────────────────
# Mode: TRAIN
# ─────────────────────────────────────────────────────────────────
def run_train(args):
    device = get_device()
    print(f"\n{'='*60}")
    print(f"  MODE : TRAIN")
    print(f"  Data : {args.data_dir}")
    print(f"  Out  : {args.model_out}")
    print(f"  Epochs / batch / lr : {args.epochs} / {args.batch_size} / {args.lr}")
    print(f"  Device : {device}")
    print(f"{'='*60}\n")

    dataset = BinFileDataset(args.data_dir)
    loader  = DataLoader(
        dataset,
        batch_size  = args.batch_size,
        shuffle     = True,
        num_workers = min(4, os.cpu_count() or 1),
        pin_memory  = (device == "cuda"),
    )

    model = BinaryAutoencoder()
    model.to(device)
    total_p = sum(p.numel() for p in model.parameters())
    print(f"  Model params     : {total_p:,}")
    print(f"  Input dim        : {INPUT_DIM:,} bits")
    print(f"  Latent dim       : {LATENT_DIM:,} float16 values")
    print(f"  Value ratio      : {INPUT_DIM / LATENT_DIM:.0f}×")
    print(f"  Bit ratio        : {INPUT_DIM / (LATENT_DIM * 16):.2f}×\n")

    optimizer = optim.Adam(model.parameters(), lr=args.lr)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", factor=0.5, patience=3
    )
    criterion = AutoencoderLoss(latent_weight=1e-4)

    best_loss = float("inf")
    history   = []

    for epoch in range(1, args.epochs + 1):
        model.train()
        t0 = time.time()
        ep_loss = ep_acc = 0.0

        for batch in loader:
            x = batch.to(device)
            optimizer.zero_grad()
            x_hat, z    = model(x)
            loss, recon = criterion(x_hat, x, z)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            ep_loss += loss.item()
            ep_acc  += bit_accuracy(x_hat, x)

        n        = len(loader)
        avg_loss = ep_loss / n
        avg_acc  = ep_acc  / n
        scheduler.step(avg_loss)

        tag = ""
        if avg_loss < best_loss:
            best_loss = avg_loss
            save_model(model, args.model_out,
                       meta={"epoch": epoch, "best_loss": best_loss,
                             "history": history})
            tag = "  ← best"

        history.append({"epoch": epoch, "loss": avg_loss, "bit_acc": avg_acc})
        print(
            f"  Epoch {epoch:>4}/{args.epochs}  "
            f"loss={avg_loss:.5f}  "
            f"bit_acc={avg_acc*100:.2f}%  "
            f"({time.time()-t0:.1f}s){tag}"
        )

    print(f"\n  Training complete.  Best loss: {best_loss:.5f}")
    print(f"  Saved: {args.model_out}\n")


# ─────────────────────────────────────────────────────────────────
# Mode: PREDICT
# ─────────────────────────────────────────────────────────────────
def run_predict(args):
    device = get_device()
    print(f"\n{'='*60}")
    print(f"  MODE  : PREDICT")
    print(f"  Model : {args.model}")
    print(f"  Input : {args.input}")
    print(f"  OutDir: {args.out_dir}")
    print(f"  Device: {device}")
    print(f"{'='*60}\n")

    print(f"  Loading model …")
    model = load_model(args.model, device)
    print(f"  Model loaded OK\n")

    input_path = Path(args.input)
    print(f"  Reading: {input_path}")
    x    = load_bin_file(str(input_path)).unsqueeze(0).to(device)  # (1, 262144)
    stem = input_path.stem
    out  = Path(args.out_dir)

    with torch.no_grad():

        # ── Compress ─────────────────────────────────────────
        z           = model.encode(x)                    # (1, 2048)
        latent_path = out / f"{stem}.latent"
        save_latent(z.squeeze(0), str(latent_path))

        latent_bytes = LATENT_DIM * 2  # float16 = 2 bytes each
        print(f"  Compressed  → {latent_path}")
        print(f"    Original : {FILE_BYTES:,} bytes  ({INPUT_DIM:,} bits)")
        print(f"    Latent   : {latent_bytes:,} bytes  ({LATENT_DIM} × float16)")
        print(f"    Ratio    : {FILE_BYTES/latent_bytes:.2f}× (bytes)  |  "
              f"{INPUT_DIM/(LATENT_DIM*16):.3f}× (bits)\n")

        # ── Decompress ───────────────────────────────────────
        x_hat_soft  = model.decode(z)                    # (1, 262144)
        x_hat_bin   = BinaryAutoencoder.binarize(x_hat_soft).squeeze(0)
        recon_path  = out / f"{stem}_reconstructed.bin"
        save_bin_file(x_hat_bin, str(recon_path))
        print(f"  Decompressed → {recon_path}")

        # ── Quality ───────────────────────────────────────────
        acc    = x_hat_bin.eq(x.squeeze(0).cpu()).float().mean().item()
        errors = int((1.0 - acc) * INPUT_DIM)
        print(f"\n  Bit accuracy : {acc*100:.4f}%")
        print(f"  Bit errors   : {errors:,} / {INPUT_DIM:,}")

    print("\n  Done ✓\n")


# ─────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────
def build_parser():
    parser = argparse.ArgumentParser(
        description="Binary Autoencoder  262144 → 2048 → 262144",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    sub = parser.add_subparsers(dest="mode", required=True)

    # train
    tr = sub.add_parser("train", help="Train on a directory of .bin files")
    tr.add_argument("--data_dir",   required=True,
                    help="Root directory (scanned recursively for .bin files)")
    tr.add_argument("--model_out",  required=True,
                    help="Where to save the best model checkpoint (.pt)")
    tr.add_argument("--epochs",     type=int,   default=10)
    tr.add_argument("--batch_size", type=int,   default=8)
    tr.add_argument("--lr",         type=float, default=1e-3)

    # predict
    pr = sub.add_parser("predict",
                        help="Compress + decompress a single .bin file")
    pr.add_argument("--model",   required=True,
                    help="Path to a saved .pt checkpoint")
    pr.add_argument("--input",   required=True,
                    help="Input .bin file (must be exactly 32768 bytes)")
    pr.add_argument("--out_dir", required=True,
                    help="Directory for output .latent and reconstructed .bin")

    return parser


def main():
    print(get_device())
    parser = build_parser()
    args   = parser.parse_args()
    if args.mode == "train":
        run_train(args)
    elif args.mode == "predict":
        run_predict(args)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()