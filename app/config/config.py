import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 🔥 CRITICAL FIX FOR EVENTLET
    SQLALCHEMY_ENGINE_OPTIONS = {
        "poolclass": None,
        "pool_pre_ping": True
    }
