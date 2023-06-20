from flask import Blueprint, request
from flask_login import login_required
from app.models import db, Item, Auction

from datetime import datetime, timedelta

from dateutil import parser

from app.forms.create_auction_form import createAuctionForm


import os
# hacky business


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



        # strStartTime = data['startTime']
        # strEndTime = data['endTime']

        # formatStartTime = parser.parse(strStartTime)
        # formatEndTime = parser.parse(strEndTime)
        strStartTime = data['startTime']
        strEndTime = data['endTime']

        strStartTime = strStartTime.split(" (")[0]
        strEndTime = strEndTime.split(" (")[0]

        timeOffset = strStartTime[-5:]
        # timeOffset = strStartTime.slice(-5)
        pos_or_neg = 1 if timeOffset[0] == "-" else -1
        #want to have the OPPOSITE of the offset

        timeOffsetHours = int(timeOffset[1 : 3]) * pos_or_neg
        # timeOffsetHours = int(timeOffset.slice(1, 3)) * pos_or_neg
        timeOffsetMinutes = int(timeOffset[3:]) * pos_or_neg
        # timeOffsetMinutes = int(timeOffset.slice(3)) * pos_or_neg


        formatStartTime = datetime.strptime(strStartTime, "%a %b %d %Y %H:%M:%S %Z%z")
        formatEndTime = datetime.strptime(strEndTime, "%a %b %d %Y %H:%M:%S %Z%z")

        if os.environ.get('FLASK_ENV') != 'production':
            formatStartTime += timedelta(hours=timeOffsetHours, minutes=timeOffsetMinutes)

            formatEndTime += timedelta(hours=timeOffsetHours, minutes=timeOffsetMinutes)
        # formatStartTime = datetime.strptime(strStartTime, "%a %b %d %Y %H:%M:%S %Z%z") + timedelta(hours=timeOffsetHours, minutes=timeOffsetMinutes)

        # formatEndTime = datetime.strptime(strEndTime, "%a %b %d %Y %H:%M:%S %Z%z") + timedelta(hours=timeOffsetHours, minutes=timeOffsetMinutes)




        # formatStartTime = datetime.strptime(strStartTime, "%a %b %d %Y %H:%M:%S %Z%z")
        # formatEndTime = datetime.strptime(strEndTime, "%a %b %d %Y %H:%M:%S %Z%z")
        # Tue Jun 20 2023 17:05:00 GMT-0400 (Eastern Daylight Time)

        #for some reason, not taking %z parameter, timezone offset


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
            # startTime = data['startTime'],
            # endTime = data['endTime'],

            startTime = formatStartTime,
            endTime = formatEndTime,


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
