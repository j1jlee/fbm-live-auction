from flask_socketio import SocketIO, emit
import os

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://aa-fbm-live-auction.onrender.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)


#handle bids
@socketio.on("socket-bid")
def handle_bid(bid_data):
    emit("socket-bid", bid_data, broadcast=True) #broadcast=True
