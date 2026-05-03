
import argparse
import os
import sys
import time
from pathlib import Path
import json

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import noisereduce as nr
import soundfile as sf
import io
import numpy as np
import asyncio

from learner import get_device, load_model, INPUT_DIM, LATENT_DIM
from encode_audio import read_wav_to_mono, slice_bytes

# Prefixes for CNN encoding and FLAC encoding
ENC_CNN = 0
ENC_FLC = 1

class AudioManager():
    def __init__(self, model_path: str):
        # Init CNN
        print("Initializing CNN model")
        self.device = get_device()
        self.model = load_model(model_path, self.device)
    
    def encode(self, from_file: str, to_file: str):
        print("Reading chunks of audio")
        amplitude_bytes, sample_rate, sample_width = read_wav_to_mono(str(from_file))

        total_bytes = len(amplitude_bytes)
        chunks = slice_bytes(amplitude_bytes, INPUT_DIM * 2)
        n_chunks = len(chunks)
        compressed_buffers = []
        
        flcs = 0
        cnns = 0
        
        for chunk in chunks:
            if len(chunk) != INPUT_DIM * 2:
                continue
            
            audio_data = np.array(np.frombuffer(chunk, dtype=np.int16))

            # Normalize to float32 in [-1.0, 1.0] range (required by soundfile)
            audio_float = audio_data.astype(np.float32) / 32768.0

            # Compress into an in-memory buffer using FLAC (lossless)
            bits = io.BytesIO()
            sf.write(bits, audio_float, sample_rate, format="FLAC")
            compressed = bits.getvalue()
            
            if len(compressed) > LATENT_DIM * 2:
                # Compress using CNN
                cnn_bits = torch.from_numpy(audio_float).unsqueeze(0).to(self.device)
                
                latent: bytes = self.model.encode(cnn_bits).squeeze(0).cpu().float().detach().numpy().astype(np.float16).tobytes()
                
                compressed_buffers.append((ENC_CNN, latent))
                cnns += 1
            else:
                compressed_buffers.append((ENC_FLC, compressed))
                flcs += 1
        
        print(f"Compression is completed. FLACs: {flcs}; CNNs: {cnns}")
        
        with open(to_file, "wb") as f:
            f.write(len(compressed_buffers).to_bytes(4, "little"))
            f.write(sample_rate.to_bytes(4, "little"))
            for mode, buf in compressed_buffers:
                # Write a mode, length and a buffer
                f.write(mode.to_bytes(4, "little"))
                f.write(len(buf).to_bytes(4, "little"))
                f.write(buf)
    
    def _decode_chunk(self, mode: int, buf: bytes, index: int, sample_rate: int) -> bytes | None:
        """Blocking worker: decompresses a single chunk, returns raw PCM int16 bytes."""
        if mode == ENC_FLC:
            audio_float, _ = sf.read(io.BytesIO(buf), dtype="float32")

        elif mode == ENC_CNN:
            # Just decode yet
            latent = np.frombuffer(buf, dtype=np.float16).astype(np.float32)
            latent_tensor = torch.from_numpy(latent).unsqueeze(0).to(self.device)
            audio_float = (
                self.model.decode(latent_tensor)
                .squeeze(0).cpu().float().detach().numpy()
            )
            
            audio_float = nr.reduce_noise(
                y=audio_float,
                sr=sample_rate,
                stationary=True,
                prop_decrease=0.6,
            )
            
            # If audio is way too noisy, add denoiser
        else:
            print(f"Warning: unknown mode {mode} at chunk {index}, skipping")
            return None

        return (audio_float * 32768.0).clip(-32768, 32767).astype(np.int16).tobytes()


    async def decode_stream(self, from_file: str):
        """Core decoder: async generator that yields raw PCM int16 chunks."""
        loop = asyncio.get_event_loop()

        with open(from_file, "rb") as f:
            n_chunks    = int.from_bytes(f.read(4), "little")
            sample_rate = int.from_bytes(f.read(4), "little")

            for i in range(n_chunks):
                mode = int.from_bytes(f.read(4), "little")
                size = int.from_bytes(f.read(4), "little")
                buf  = f.read(size)

                pcm_bytes = await loop.run_in_executor(
                    None, self._decode_chunk, mode, buf, i, sample_rate
                )

                if pcm_bytes is not None:
                    yield pcm_bytes

async def decode(audio_manager: AudioManager, from_file: str, to_file: str):
    """Adapter: collects decode_stream output and writes it as a WAV file."""
    buffer = io.BytesIO()
    async for chunk in audio_manager.decode_stream(from_file):
        buffer.write(chunk)

    buffer.seek(0)
    # need sample_rate separately now — read it once upfront
    with open(from_file, "rb") as f:
        f.read(4)  # skip n_chunks
        sample_rate = int.from_bytes(f.read(4), "little")

    audio_int16 = np.frombuffer(buffer.read(), dtype=np.int16)
    sf.write(to_file, audio_int16.astype(np.float32) / 32768.0, sample_rate)

    print(f"Decoded → '{to_file}'")

async def main():
    audio_manager = AudioManager("/home/vlados/Desktop/Uni/BackTrack/storage/learn/try2.pt")

    audio_manager.encode("/home/vlados/Desktop/Uni/BackTrack/storage/learn/overlearn/test2.wav", "/home/vlados/Desktop/Uni/BackTrack/storage/learn/overlearn/comp2.bin")
    await decode(audio_manager, "/home/vlados/Desktop/Uni/BackTrack/storage/learn/overlearn/comp2.bin", "/home/vlados/Desktop/Uni/BackTrack/storage/learn/overlearn/decomp2.wav")
    
if __name__ == "__main__":
    asyncio.run(main())