#!/usr/bin/env python3
"""
Audio Decoder Script
Reconstructs a WAV file from binary slice files produced by encode_audio.py.

Usage (single slice file):
    python decode_audio.py --input <path/to/slice.bin> --output <output.wav>

Usage (reconstruct from all slices in a directory):
    python decode_audio.py --input <path/to/slice_dir/> --output <output.wav>

Examples:
    python decode_audio.py --input ./binary_output/my_song/slice_000000.bin --output restored.wav
    python decode_audio.py --input ./binary_output/my_song/ --output restored.wav
"""

import argparse
import json
import os
import struct
import wave
from pathlib import Path

MAGIC = b'RAWAMP01'


def read_binary_slice(filepath: str) -> tuple[bytes, dict]:
    """
    Read a binary slice file and return (amplitude_bytes, metadata).

    Binary format:
        [8 bytes]  Magic: 'RAWAMP01'
        [4 bytes]  Metadata length (little-endian uint32)
        [N bytes]  Metadata JSON (UTF-8)
        [M bytes]  Raw amplitude data
    """
    with open(filepath, 'rb') as f:
        amplitude_data = f.read()

    return amplitude_data, dict()


def collect_slices(input_path: Path) -> tuple[bytes, dict]:
    """
    Collect all slice files from a directory (or a single file),
    sort them by slice index, and concatenate the amplitude bytes.
    Returns (combined_amplitude_bytes, metadata_from_first_slice).
    """
    if input_path.is_file():
        # Single slice — reconstruct from just that one chunk
        data, meta = read_binary_slice(str(input_path))
        return data, meta

    # Directory: find all .bin files
    bin_files = sorted(input_path.glob('slice_*.bin'))
    if not bin_files:
        raise FileNotFoundError(
            f"No slice files (slice_*.bin) found in '{input_path}'."
        )

    print(f"Found {len(bin_files)} slice file(s) in '{input_path}'.")

    all_data = []
    base_meta = None

    for bf in bin_files:
        data, meta = read_binary_slice(str(bf))
        if base_meta is None:
            base_meta = meta
        all_data.append(data)

    return b''.join(all_data), base_meta


def write_wav(output_path: str, amplitude_bytes: bytes, metadata: dict):
    """Write raw 16-bit mono PCM bytes to a WAV file."""
    sample_rate = 44100
    sample_width = 2  # default 16-bit
    channels = 1

    n_frames = len(amplitude_bytes) // (sample_width * channels)

    with wave.open(output_path, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(sample_rate)
        wf.writeframes(amplitude_bytes[:n_frames * sample_width * channels])

    print(f"WAV file written: {output_path}")
    print(f"  Channels    : {channels} (mono)")
    print(f"  Sample rate : {sample_rate} Hz")
    print(f"  Sample width: {sample_width} byte(s) (16-bit PCM)")
    print(f"  Frames      : {n_frames}")
    duration = n_frames / sample_rate
    print(f"  Duration    : {duration:.3f} s")


def main():
    parser = argparse.ArgumentParser(
        description="Decode binary amplitude slice(s) back to a WAV file."
    )
    parser.add_argument(
        '--input', '-i', required=True,
        help='Path to a single .bin slice file OR a directory of slice files'
    )
    parser.add_argument(
        '--output', '-o', required=True,
        help='Path for the output WAV file (e.g. restored.wav)'
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        parser.error(f"Input path does not exist: {args.input}")

    output_path = args.output
    if not output_path.lower().endswith('.wav'):
        output_path += '.wav'

    # Ensure output directory exists
    out_dir = Path(output_path).parent
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Reading from : {input_path}")
    amplitude_bytes, metadata = collect_slices(input_path)

    print(f"\nMetadata:")
    for k, v in metadata.items():
        print(f"  {k}: {v}")
    print()

    write_wav(output_path, amplitude_bytes, metadata)
    print("\nDone.")


if __name__ == '__main__':
    main()
