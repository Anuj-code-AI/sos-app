from flask import Blueprint, send_from_directory

demo_bp = Blueprint("demo", __name__)

@demo_bp.route("/demo")
def demo_page():
    return send_from_directory("templates", "demo.html")
