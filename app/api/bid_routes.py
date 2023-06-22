from flask import Blueprint, request
from flask_login import login_required

from datetime import datetime;

from app.models import db, Bid, Auction

from app.forms.create_bid_form import createBidForm

from app.api.time_format import time_format
# from app.forms.update_bid_form import updateBidForm

bid_routes = Blueprint('bids', __name__)


@bid_routes.route('/')
# @login_required
def get_all_bids():
    """
    Query for all bids and returns them in a list of bid dictionaries
    """
    bids = Bid.query.all()
    return {'bids': [bid.to_dict() for bid in bids]}


@bid_routes.route('/<int:id>')
# @login_required
def get_single_bid(id):
    """
    Query for a bid by id and returns that bid in a dictionary
    """
    bid = Bid.query.get(id)
    return bid.to_dict()

@bid_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_single_bid(id):
    bid = Bid.query.get(id)

    if bid is None:
        #syntax for returning 404??
        return {"error": f"Bid {id} not found for delete"}, 404
    # bid_name = bid.name

    db.session.delete(bid)
    db.session.commit()

    return {"message": f"bid {id} successfully deleted"}


@bid_routes.route('/auctions/<int:auctionId>', methods=["DELETE"])
#/bids/auctions/:auctionId
@login_required
def delete_all_bids_of_auction(auctionId):
    auction_bids = Bid.query.filter(Bid.auctionId == auctionId)

    if auction_bids is None:
        #syntax for returning 404??
        return {"error": f"Bids not found for delete, for auction {auctionId}"}, 404
    # bid_name = bid.name

    db.session.delete(auction_bids)
    db.session.commit()

    return {"message": f"All bids of auction {auctionId} successfully deleted"}



@bid_routes.route('/new', methods=["POST"])
@login_required
def post_new_bid():
    form = createBidForm(csrf_enabled=True)


    form['csrf_token'].data = request.cookies['csrf_token']
    #THE KEY IS CSRF_TOKEN, NOT CSRF-TOKEN

    if form.validate_on_submit():
        data = form.data

        new_bid = Bid(
            auctionId = data['auctionId'],
            bidderId = data['bidderId'],
            # timeOfBid = time_format(data['timeOfBid']),
            bidAmountCents = data['bidAmountCents'],
            timeOfBid = datetime.utcnow()
        )

        db.session.add(new_bid)
        db.session.commit()
        return new_bid.to_dict()

    if form.errors:
        return {"errors" : form.errors}


# @bid_routes.route('/post_test', methods=["POST"])
# # @login_required
# def bid_post_test():
#     # print("attempting post test")
#     # print("\n\n\ndiff inputs")
#     # print("request.args", request.args)
#     # print("request.form", request.form)
#     # print("request.values", request.values)

#     #remember to set Content-Type to "application/json"
#     print("request.get_json()", request.get_json())
#     post_data = (request.get_json(force=True))
#     print(post_data)
#     return {"message": post_data}
