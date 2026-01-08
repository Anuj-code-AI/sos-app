from flask import Blueprint, request, redirect, session
from app.services.profile_service import ProfileService
from flask import send_from_directory

profile_bp = Blueprint("profile", __name__)
print("🔥🔥🔥 NEW PROFILE CONTROLLER LOADED FROM UI-ONLY BRANCH 🔥🔥🔥")

@profile_bp.route("/profile", methods=["GET"])
def profile_page():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    return send_from_directory("templates", "profile.html")

@profile_bp.route("/profile", methods=["POST"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    name = request.form.get("name")
    address = request.form.get("address")

    ProfileService.update_profile(user_id, name, address)
    return redirect("/profile")

@app.route("/api/me")
def get_me():
    return {"user_id": session.get("user_id")}

@profile_bp.route("/api/profile", methods=["GET"])
def get_profile():
    user_id = session.get("user_id")
    if not user_id:
        return {"error": "not logged in"}, 401

    user = ProfileService.get_user_profile(user_id)

    return {
        "name": user.name,
        "email": user.email,
        "address": user.address
    }
