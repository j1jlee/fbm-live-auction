# from flask_socketio import SocketIO, emit
# import os

# if os.environ.get("FLASK_ENV") == "production":
#     origins = [
#         "https://aa-fbm-live-auction.onrender.com"
#     ]
# else:
#     origins = "*"

# # create your SocketIO instance
# socketio = SocketIO(cors_allowed_origins=origins)


# #handle bids
# @socketio.on("socket-bid")
# def handle_bid(bid_data):
#     emit("socket-bid", bid_data, broadcast=True) #broadcast=True


from flask_socketio import SocketIO, emit
import os


# configure cors_allowed_origins
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://aa-fbm-live-auction.onrender.com',
        'https://aa-fbm-live-auction.onrender.com'
    ]
else:
    origins = "*"

# initialize your socket instance
socketio = SocketIO(cors_allowed_origins=origins)


# handle chat messages
#1, define EVENT HERE, how to handle event
@socketio.on("chatEvent")
def handle_chat(data):
    # emit("chatEvent", data)
    emit("chatEvent", data, broadcast=True)

#EMIT is broadcast
#ON is receiver

@socketio.on("bidEvent")
def handle_bid(data):
    emit("bidEvent", data, broadcast=True)

@socketio.on("newAuctionEvent")
def handle_new_auction(data):
    emit("newAuctionEvent", data, broadcast=True)

# @socketio.on("closeAuctionEvent")
# def handle_close_auction(data):
#     emit("closeAuctionEvent", data, broadcast=True)
