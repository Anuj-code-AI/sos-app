from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.services.auth_service import AuthService
from flask import session


auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/", methods=["GET"])
def login_page():
    return render_template("login.html")

@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]

    success, result = AuthService.login_user(email, password)
    if not success:
        flash(result)
        return redirect(url_for("auth.login_page"))

    # 🔥 ADD THIS LINE HERE (AFTER SUCCESSFUL LOGIN)
    session["user_id"] = result.id

    return redirect(url_for("auth.dashboard"))


@auth_bp.route("/register", methods=["POST"])
def register():
    name = request.form["name"]
    email = request.form["email"]
    password = request.form["password"]

    success, message = AuthService.register_user(name, email, password)
    flash(message)
    return redirect(url_for("auth.login_page"))

@auth_bp.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")
