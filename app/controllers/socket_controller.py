from flask import request
from flask_socketio import emit
from app.socket import socketio

connected_users = {}  # user_id (str) -> socket_id


@socketio.on("connect")
def handle_connect():
    user_id = request.args.get("user_id")

    if not user_id or user_id == "null":
        print("❌ REJECTED SOCKET WITH INVALID USER")
        return False   # reject connection

    user_id = str(user_id)
    connected_users[user_id] = request.sid


@socketio.on("disconnect")
def handle_disconnect():
    for uid, sid in list(connected_users.items()):
        if sid == request.sid:
            del connected_users[uid]
            print("❌ USER DISCONNECTED:", uid)

@socketio.on("help_accepted")
def handle_help_accepted(data):
    sender_id = str(data.get("sender_id"))

    sender_socket = connected_users.get(sender_id)
    print("👉 HELP ACCEPTED FOR:", sender_id, "SOCKET:", sender_socket)

    if sender_socket:
        emit("help_accepted_ack",
             {"message": "✅ Help accepted by someone nearby"},
             to=sender_socket)

@socketio.on("helper_location_update")
def handle_helper_location(data):
    sender_id = str(data["sender_id"])

    print("📡 HELPER LOCATION UPDATE FOR:", sender_id)
    print("CONNECTED USERS:", connected_users)

    sender_socket = connected_users.get(sender_id)

    if sender_socket:
        emit("helper_location", data, to=sender_socket)
        print("✅ LOCATION SENT TO SENDER")
    else:
        print("❌ SENDER SOCKET NOT FOUND")
