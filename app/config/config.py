import os
from sqlalchemy.pool import NullPool

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ✅ CORRECT EVENTLET-SAFE CONFIG
    SQLALCHEMY_ENGINE_OPTIONS = {
        "poolclass": NullPool,
        "pool_pre_ping": True
    }
