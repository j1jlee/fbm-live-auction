from app.models import db, Auction, User, Bid, environment, SCHEMA
from sqlalchemy.sql import text

from datetime import datetime


def seed_bids():

    demo_auction_ref = Auction.query.filter(Auction.auctionName == "First Test Auction").first()

    marnie_bidder_ref = User.query.filter(User.username == "marnie").first()

    bid_test = Bid(
        bidder = marnie_bidder_ref,
        bidAuction = demo_auction_ref,
        timeOfBid = datetime.strptime("20/07/23 16:45", "%d/%m/%y %H:%M"),
        bidAmountCents = 55000
    )

    # auction_test = Auction(
    #     auctionName = "First Test Auction",
    #     auctionDescription = "We're selling only the rarest of items today!",
    #     auctionOpen = True,

    #     startingBidCents = 50000,
    #     startTime = datetime.strptime("20/07/23 16:30", "%d/%m/%y %H:%M"),
    #     endTime = datetime.strptime("20/07/23 17:00", "%d/%m/%y %H:%M")
    #     #finalBidCents, createdAt, updatedAt, all default
    # )

    db.session.add(bid_test)
    db.session.commit()

"""              'id': self.id,

            'auctionId': self.auctionId,
            'bidderId': self.bidderId,
            'timeOfBid': self.timeOfBid,
            'bidAmountCents': self.bidAmountCents

            #test to see if this works later
            #'bidder': self.bidder
            #'auction': self.auction
"""


def undo_bids():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bids RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bids"))

    db.session.commit()
