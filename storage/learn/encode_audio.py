#!/usr/bin/env python3
"""
Audio Encoder Script
Converts audio files in a folder to mono, extracts raw amplitude bytes,
slices them by a specified size, and stores results in binary format.

Usage:
    python encode_audio.py --input <folder> --output <folder> --slice-size <bytes>

Example:
    python encode_audio.py --input ./audio_files --output ./binary_output --slice-size 4096
"""

import argparse
import os
import struct
import wave
import json
from pathlib import Path

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

SUPPORTED_EXTENSIONS = {'.wav', '.aiff', '.aif'}

# Header magic bytes to identify our binary format
MAGIC = b'RAWAMP01'


def read_wav_to_mono(filepath: str) -> tuple[bytes, int, int]:
    """
    Read a WAV file and convert to mono 16-bit PCM.
    Returns (raw_bytes, sample_rate, sample_width_bytes).
    """
    with wave.open(filepath, 'rb') as wf:
        n_channels = wf.getnchannels()
        sample_rate = wf.getframerate()
        sample_width = wf.getsampwidth()  # bytes per sample per channel
        n_frames = wf.getnframes()

        raw = wf.readframes(n_frames)

    # Determine format string for struct unpacking
    if sample_width == 1:
        fmt_char = 'b'   # signed 8-bit
    elif sample_width == 2:
        fmt_char = 'h'   # signed 16-bit
    elif sample_width == 4:
        fmt_char = 'i'   # signed 32-bit
    else:
        raise ValueError(f"Unsupported sample width: {sample_width} bytes")

    total_samples = n_frames * n_channels
    samples = struct.unpack(f'<{total_samples}{fmt_char}', raw)

    # Mix down to mono by averaging channels
    if n_channels > 1:
        mono_samples = []
        for i in range(0, len(samples), n_channels):
            frame = samples[i:i + n_channels]
            avg = int(sum(frame) / n_channels)
            mono_samples.append(avg)
    else:
        mono_samples = list(samples)

    # Normalize to 16-bit signed integers
    if sample_width == 1:
        # 8-bit: scale from -128..127 to -32768..32767
        mono_samples = [s * 256 for s in mono_samples]
        out_width = 2
    elif sample_width == 2:
        out_width = 2
    elif sample_width == 4:
        # 32-bit: scale down to 16-bit
        mono_samples = [s >> 16 for s in mono_samples]
        out_width = 2

    amplitude_bytes = struct.pack(f'<{len(mono_samples)}h', *mono_samples)
    return amplitude_bytes, sample_rate, out_width


def slice_bytes(data: bytes, slice_size: int) -> list[bytes]:
    """Slice bytes into chunks of slice_size."""
    return [data[i:i + slice_size] for i in range(0, len(data), slice_size)]


def write_binary_slice(output_path: str, chunk: bytes, metadata: dict):
    with open(output_path, 'wb') as f:
        f.write(chunk)


def process_folder(input_folder: str, output_folder: str, slice_size: int):
    input_path = Path(input_folder)
    output_path = Path(output_folder)

    if not input_path.exists():
        raise FileNotFoundError(f"Input folder not found: {input_folder}")

    output_path.mkdir(parents=True, exist_ok=True)

    audio_files = [
        f for f in input_path.iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not audio_files:
        print(f"No supported audio files found in '{input_folder}'.")
        print(f"Supported formats: {', '.join(SUPPORTED_EXTENSIONS)}")
        return

    print(f"Found {len(audio_files)} audio file(s) to process.\n")

    for audio_file in sorted(audio_files):
        print(f"Processing: {audio_file.name}")
        try:
            amplitude_bytes, sample_rate, sample_width = read_wav_to_mono(str(audio_file))

            total_bytes = len(amplitude_bytes)
            chunks = slice_bytes(amplitude_bytes, slice_size)
            n_chunks = len(chunks)

            print(f"  Sample rate   : {sample_rate} Hz")
            print(f"  Total bytes   : {total_bytes}")
            print(f"  Slice size    : {slice_size} bytes")
            print(f"  Slices created: {n_chunks}")

            # Create a subdirectory per source file
            file_out_dir = output_path / audio_file.stem
            file_out_dir.mkdir(parents=True, exist_ok=True)

            metadata_base = {
                "source_file": audio_file.name,
                "sample_rate": sample_rate,
                "sample_width": sample_width,
                "channels": 1,
                "total_bytes": total_bytes,
                "slice_size": slice_size,
                "total_slices": n_chunks,
            }

            for idx, chunk in enumerate(chunks):
                meta = {**metadata_base, "slice_index": idx, "chunk_bytes": len(chunk)}
                out_file = file_out_dir / f"slice_{idx:06d}.bin"
                write_binary_slice(str(out_file), chunk, meta)

            print(f"  Output dir    : {file_out_dir}\n")

        except Exception as e:
            print(f"  ERROR: {e}\n")

    print("Done.")


def main():
    parser = argparse.ArgumentParser(
        description="Encode audio files to raw amplitude binary slices."
    )
    parser.add_argument(
        '--input', '-i', required=True,
        help='Path to input folder containing audio files'
    )
    parser.add_argument(
        '--output', '-o', required=True,
        help='Path to output folder for binary slices'
    )
    parser.add_argument(
        '--slice-size', '-s', type=int, default=4096,
        help='Slice size in bytes (default: 4096)'
    )
    args = parser.parse_args()

    if args.slice_size <= 0:
        parser.error("--slice-size must be a positive integer")

    process_folder(args.input, args.output, args.slice_size)


if __name__ == '__main__':
    main()
