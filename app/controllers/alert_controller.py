from flask import Blueprint, request, jsonify, session
from app.services.alert_service import AlertService

alert_bp = Blueprint("alert", __name__)

@alert_bp.route("/alert/harassment", methods=["POST"])
def harassment_alert():
    data = request.json

    lat = data.get("lat")
    lng = data.get("lng")
    message = data.get("message", "")

    sender_id = session.get("user_id")

    if not sender_id:
        return jsonify({"error": "Unauthorized"}), 401

    if lat is None or lng is None:
        return jsonify({"error": "Location is required"}), 400

    AlertService.send_harassment_alert(lat, lng, sender_id, message)

    return jsonify({"status": "alert sent"})
