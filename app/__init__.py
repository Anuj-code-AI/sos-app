from flask import Flask
from app.config.config import Config
from app.routes import register_routes
from app.extensions import db
from app.socket import socketio

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    socketio.init_app(app)

    with app.app_context():
        db.create_all()

    register_routes(app)
    return app
