from app.controllers.auth_controller import auth_bp
from app.controllers.alert_controller import alert_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(alert_bp)
