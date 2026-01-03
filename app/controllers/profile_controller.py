from flask import Blueprint, render_template, request, redirect, session
from app.services.profile_service import ProfileService

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile", methods=["GET"])
def profile_page():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    user = ProfileService.get_user_profile(user_id)
    return render_template("profile.html", user=user)

@profile_bp.route("/profile", methods=["POST"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    name = request.form.get("name")
    address = request.form.get("address")

    ProfileService.update_profile(user_id, name, address)
    return redirect("/profile")
