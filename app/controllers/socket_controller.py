from flask import request,session
from flask_socketio import emit
from app.socket import socketio

connected_users = {}  # user_id (str) -> socket_id



@socketio.on("connect")
def handle_connect():
    print("🟢 SOCKET CONNECTED:", request.sid)

@socketio.on("register_user")
def register_user(data):
    user_id = str(data.get("user_id"))

    if not user_id or user_id == "null":
        print("❌ INVALID REGISTER USER")
        return

    connected_users[user_id] = request.sid
    print("🟢 USER REGISTERED:", user_id, "=>", request.sid)
    print("CONNECTED USERS:", connected_users)


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
