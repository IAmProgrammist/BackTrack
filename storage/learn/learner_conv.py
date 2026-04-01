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
INPUT_DIM   = 16384           # numbers  (= 262 144 bytes)
LATENT_DIM  = 4096            # float16 values
HIDDEN_DIMS = [8192, 6144]
FILE_BYTES  = INPUT_DIM * 2    # 32 768 bytes


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
class AudioAutoencoder(nn.Module):
    def __init__(self, input_size=INPUT_DIM, latent_dim=LATENT_DIM):
        super().__init__()
        # Энкодер: 16000 → latent_dim
        self.encoder = nn.Sequential(
            # [B, 1, 16000] → [B, 32, 8000]
            nn.Conv1d(1, 32, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(32),
            nn.ReLU(),

            # [B, 32, 8000] → [B, 64, 4000]
            nn.Conv1d(32, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(64),
            nn.ReLU(),

            # [B, 64, 4000] → [B, 128, 2000]
            nn.Conv1d(64, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(128),
            nn.ReLU(),

            # [B, 128, 2000] → [B, 256, 1000]
            nn.Conv1d(128, 256, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),

            # [B, 256, 1000] → [B, 256, 500]
            nn.Conv1d(256, 256, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),
        )

        # Bottleneck: flatten → linear → latent
        self.bottleneck_size = 256 * 512  # 128_000
        self.fc_enc = nn.Linear(self.bottleneck_size, latent_dim)
        self.fc_dec = nn.Linear(latent_dim, self.bottleneck_size)

        # Декодер: latent_dim → 16000
        self.decoder = nn.Sequential(
            # [B, 256, 500] → [B, 256, 1000]
            nn.ConvTranspose1d(256, 256, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),

            # [B, 256, 1000] → [B, 128, 2000]
            nn.ConvTranspose1d(256, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(128),
            nn.ReLU(),

            # [B, 128, 2000] → [B, 64, 4000]
            nn.ConvTranspose1d(128, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(64),
            nn.ReLU(),

            # [B, 64, 4000] → [B, 32, 8000]
            nn.ConvTranspose1d(64, 32, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm1d(32),
            nn.ReLU(),

            # [B, 32, 8000] → [B, 1, 16000]
            nn.ConvTranspose1d(32, 1, kernel_size=4, stride=2, padding=1),
            nn.Tanh()  # или Sigmoid, если данные в [0, 1]
        )

    def encode(self, x):
        # x: [B, 16000] → добавляем канал → [B, 1, 16000]
        x = x.unsqueeze(1)
        x = self.encoder(x)
        x = x.view(x.size(0), -1)       # flatten
        return self.fc_enc(x)            # [B, latent_dim]

    def decode(self, z):
        x = self.fc_dec(z)               # [B, bottleneck_size]
        x = x.view(x.size(0), 256, 512) # reshape
        x = self.decoder(x)              # [B, 1, 16000]
        return x.squeeze(1)              # [B, 16000]

    def forward(self, x):
        z = self.encode(x)
        return self.decode(z), z


# ─────────────────────────────────────────────────────────────────
# Loss
# ─────────────────────────────────────────────────────────────────
class AutoencoderLoss(nn.Module):
    def __init__(self, latent_weight=0):
        super().__init__()
        self.mse = nn.MSELoss()  # ← renamed
        self.lw  = latent_weight

    def forward(self, x_hat, x, z):
        recon = self.mse(x_hat, x)
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
        bits = np.array(
            np.frombuffer(raw, dtype=np.uint16)
        ).astype(np.float32) / 65535.0 
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
    bits = np.array(
        np.frombuffer(raw, dtype=np.uint16)
    ).astype(np.float32) / 65535.0 
    return torch.from_numpy(bits)


def save_bin_file(bits_tensor: torch.Tensor, path: str):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    arr    = bits_tensor.cpu().numpy()
    Path(path).write_bytes(arr.tobytes())


def save_latent(z: torch.Tensor, path: str):
    """Save latent vector (2048,) as raw float16 bytes (.latent)."""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    arr = z.cpu().float().numpy().astype(np.float16)
    Path(path).write_bytes(arr.tobytes())


def reconstruction_quality(x_hat: torch.Tensor, x: torch.Tensor) -> float:
    """Returns % of samples within 5% of original value"""
    return (x_hat - x).abs().lt(0.05).float().mean().item()


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


def load_model(path, device="cpu") -> AudioAutoencoder:
    ckpt  = torch.load(path, map_location=device, weights_only=False)
    model = AudioAutoencoder(
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

    model = AudioAutoencoder()
    model.to(device)
    total_p = sum(p.numel() for p in model.parameters())
    print(f"  Model params     : {total_p:,}")
    print(f"  Input dim        : {INPUT_DIM:,} nums")
    print(f"  Latent dim       : {LATENT_DIM:,} float16 values")
    print(f"  Value ratio      : {INPUT_DIM / LATENT_DIM:.0f}×")
    print(f"  Bit ratio        : {INPUT_DIM / (LATENT_DIM * 16):.2f}×\n")

    optimizer = optim.Adam(model.parameters(), lr=args.lr)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, patience=10, factor=0.5
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
            ep_acc  += reconstruction_quality(x_hat, x)

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

        history.append({"epoch": epoch, "loss": avg_loss, "acc": avg_acc})
        print(
            f"  Epoch {epoch:>4}/{args.epochs}  "
            f"loss={avg_loss:.5f}  "
            f"acc={avg_acc*100:.2f}%  "
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
        x_hat_bin   = (x_hat_soft.clamp(0, 1).cpu() * 65535).to(torch.uint16)
        print(len(x_hat_bin))
        print(x_hat_bin)
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
    tr.add_argument("--lr",         type=float, default=1e-4)

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