from flask import Blueprint, redirect, url_for
from app.services.alert_service import AlertService
from flask import render_template

alert_bp = Blueprint("alert", __name__)

@alert_bp.route("/alert/harassment", methods=["POST"])
def harassment_alert():
    AlertService.send_harassment_alert()
    return redirect(url_for("alert.view_alerts"))

@alert_bp.route("/alerts")
def view_alerts():
    from app.repositories.alert_repository import AlertRepository
    alerts = AlertRepository.get_all_alerts()
    return render_template("alerts.html", alerts=alerts)

from flask import jsonify

@alert_bp.route("/api/alerts")
def api_alerts():
    from app.repositories.alert_repository import AlertRepository
    alerts = AlertRepository.get_all_alerts()
    return jsonify([
        {
            "message": alert.message,
            "created_at": alert.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for alert in alerts
    ])
