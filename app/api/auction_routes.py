from flask import Blueprint, request
from flask_login import login_required
from app.models import db, Item, Auction

from datetime import datetime

from app.forms.create_auction_form import createAuctionForm

auction_routes = Blueprint('auctions', __name__)


@auction_routes.route('/')
# @login_required
def get_all_auctions():
    """
    Query for all auctions and returns them in a list of auction dictionaries
    """
    auctions = Auction.query.all()
    return {'auctions': [auction.to_dict() for auction in auctions]}


@auction_routes.route('/<int:id>')
# @login_required
def get_single_auction(id):
    """
    Query for a auction by id and returns that auction in a dictionary
    """
    single_auction = Auction.query.get(id)
    return single_auction.to_dict()


@auction_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_single_auction(id):
    auction = Auction.query.get(id)

    if auction is None:
        #syntax for returning 404??
        return {"error": f"auction {id} not found for delete"}, 404
    auction_name = auction.name

    db.session.delete(auction)
    db.session.commit()

    return {"message": f"Auction {auction_name} successfully deleted"}

@auction_routes.route('/<int:id>', methods=["PUT"])
# @auction_routes.route('/<int:id>', methods=["UPDATE"])
@login_required
def update_single_auction(id):

    print("\n\n\nAt update auction flask route")
    print("getting id>>", id)
    #edit this
    form = updateAuctionForm()

    # print("at form")

    form['csrf_token'].data = request.cookies['csrf_token']


    print("auction form data csrf token")


    # print("request data", request.data)
    edit_auction = Auction.query.get(id)
    if edit_auction is None:
        return {"error": f"Auction {id} not found to edit"}, 404

    print("\n\n\nChanging: ")

    # edit_auction = edit_auction.to_dict()


    #EDIT LATER WHEN MAKING FORM
    ###
    #
    #
    #

    if form.validate_on_submit():
        data = form.data
        if data['auctionName']:
            print(f"Changing auction name from {edit_auction.auctionName} to {data['auctionName']}")
            edit_auction.auctionName = data['auctionName']

        if data['auctionDescription']:
            print(f"Changing auction description from {edit_auction.auctionDescription} to {data['auctionDescription']}")
            edit_auction.auctionDescription = data['auctionDescription']
        if data['auctionOpen']:
            print(f"Changing auction open bool from {edit_auction.auctionOpen} to {data['auctionOpen']}")
            edit_auction.auctionOpen = data['auctionOpen']

        if data['startingBidCents']:
            print(f"Changing auction startingBidCents from {edit_auction.startingBidCents} to {data['startingBidCents']}")
            edit_auction.startingBidCents = data['startingBidCents']

        db.session.commit()
        return edit_auction.to_dict()

    return { "errors": "Unknown error in update auction"}
    # if form.errors:
    #     return {"errors" : form.errors}





@auction_routes.route('/new', methods=["POST"])
@login_required
def post_new_auction():

    print("At create auction PY")

    form = createAuctionForm(csrf_enabled=True)

    form['csrf_token'].data = request.cookies['csrf_token']
    #THE KEY IS CSRF_TOKEN, NOT CSRF-TOKEN

    if form.validate_on_submit():
        data = form.data
        new_auction = Auction(
            # name = data['name'],
            # description = data['description'],
            # lastKnownPriceCents = data['lastKnownPriceCents'],
            # imageUrl = data['imageUrl'],
            # ownerId = data['ownerId']

            auctionName = data['auctionName'],
            auctionDescription = data['auctionDescription'],
            auctionItemId = data['auctionItemId'],
            startingBidCents = data['startingBidCents'],
            startTime = data['startTime'],
            endTime = data['endTime'],

            createdAt = datetime.utcnow(),
            updatedAt = datetime.utcnow()

        )

        db.session.add(new_auction)
        db.session.commit()
        return new_auction.to_dict()

    if form.errors:
        return {"errors" : form.errors}


@auction_routes.route('/post_test', methods=["POST"])
# @login_required
def item_post_test():
    # print("attempting post test")
    # print("\n\n\ndiff inputs")
    # print("request.args", request.args)
    # print("request.form", request.form)
    # print("request.values", request.values)

    #remember to set Content-Type to "application/json"
    print("request.get_json()", request.get_json())
    post_data = (request.get_json(force=True))
    print(post_data)
    return {"message": post_data}
