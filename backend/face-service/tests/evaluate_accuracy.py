import argparse
import json
import os
from pathlib import Path
import cv2
import numpy as np
from insightface.app import FaceAnalysis


def load_model():
    app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    app.prepare(ctx_id=0, det_size=(640, 640))
    return app
