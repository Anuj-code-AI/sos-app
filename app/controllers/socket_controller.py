from flask import request
from flask_socketio import emit
from app.socket import socketio

connected_users = {}  # user_id -> socket_id

@socketio.on("connect")
def handle_connect():
    user_id = request.args.get("user_id")
    if user_id:
        connected_users[user_id] = request.sid
        print(f"User {user_id} connected")

@socketio.on("disconnect")
def handle_disconnect():
    for uid, sid in list(connected_users.items()):
        if sid == request.sid:
            del connected_users[uid]
            print(f"User {uid} disconnected")

@socketio.on("help_accepted")
def handle_help_accepted(data):
    sender_id = data.get("sender_id")
    if not sender_id:
        return

    sender_socket = connected_users.get(str(sender_id))
    if sender_socket:
        emit(
            "help_accepted_ack",
            {"message": "✅ Help accepted by someone nearby"},
            to=sender_socket
        )

