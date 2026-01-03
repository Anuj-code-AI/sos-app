from app.controllers.auth_controller import auth_bp
from app.controllers.alert_controller import alert_bp
from app.controllers.profile_controller import profile_bp   # ✅ ADD

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(alert_bp)
    app.register_blueprint(profile_bp) 
