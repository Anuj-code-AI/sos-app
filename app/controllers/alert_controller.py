from flask import Blueprint, request, jsonify, session
from app.services.alert_service import AlertService

alert_bp = Blueprint("alert", __name__)

@alert_bp.route("/alert/harassment", methods=["POST"])
def harassment_alert():
    data = request.json
    print("DATA:", data)

    lat = data.get("lat")
    lng = data.get("lng")

    sender_id = session.get("user_id")

    if not sender_id:
        return jsonify({"error": "Unauthorized"}), 401

    AlertService.send_harassment_alert(lat, lng, sender_id)
    return jsonify({"status": "alert sent"})
