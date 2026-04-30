
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

from learner import get_device, load_model, INPUT_DIM
from encode_audio import read_wav_to_mono, slice_bytes

class AudioManager():
    def __init__(self, model_path: str):
        # Init CNN
        print("Initializing CNN model")
        device = get_device()
        self.model = load_model(model_path, device)
    
    def encode(from_file: str, to_file: str):
        print("Reading chunks of audio")
        amplitude_bytes, sample_rate, sample_width = read_wav_to_mono(str(from_file))

        total_bytes = len(amplitude_bytes)
        chunks = slice_bytes(amplitude_bytes, INPUT_DIM)
        n_chunks = len(chunks)
        
        for chunk in chunks:
            