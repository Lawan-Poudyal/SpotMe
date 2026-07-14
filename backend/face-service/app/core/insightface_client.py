import threading
from insightface.app import FaceAnalysis


class InsightFaceClient:
    _instance =None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._init_model()
        return cls._instance
    
    def _init_model(self):
        self.app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"]
        )
        self.app.prepare(ctx_id=0, det_size=(640, 640))

    def get_app(self):
        return self.app

insightface_client = InsightFaceClient()
