from flask import Blueprint, send_from_directory, request, redirect, url_for, flash
from app.services.auth_service import AuthService
from flask import session

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/", methods=["GET"])
def login_page():
    return send_from_directory('templates', 'login.html')

@auth_bp.route("/login", methods=["GET","POST"])
def login():
    if request.method == "GET":
        return send_from_directory("templates", "login.html")

    # POST logic here
    email = request.form["email"]
    password = request.form["password"]

    success, result = AuthService.login_user(email, password)
    if not success:
        flash(result)
        return redirect(url_for("auth.login_page"))

    # 🔥 ADD THIS LINE HERE (AFTER SUCCESSFUL LOGIN)
    session["user_id"] = result.id

    return redirect(url_for("auth.dashboard"))

@auth_bp.route("/logout",methods=["GET"])
def logout():
    session.clear()
    return redirect("/login")

@auth_bp.route("/register", methods=["GET"])
def register_page():
    return send_from_directory('templates', 'register.html')

@auth_bp.route("/register", methods=["POST"])
def register():
    name = request.form["name"]
    email = request.form["email"]
    password = request.form["password"]
    address = request.form["address"]

    success, message = AuthService.register_user(
        name, email, password, address
    )

    flash(message)
    return redirect(url_for("auth.login_page"))



@auth_bp.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("auth.login_page"))
    return send_from_directory('templates', 'dashboard.html')
