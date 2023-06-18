from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Bid(db.Model):
    __tablename__ = 'bids'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    #relationships, foreign keys
    auctionId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("auctions.id")))
    auction = db.relationship("Auction", back_populates="bids")
    #bidder
    bidderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    bidder = db.relationship("User", back_populates="bids")

    timeOfBid = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    bidAmountCents = db.Column(db.Integer, nullable=False, default=1)


    #https://github.com/appacademy/Module-6-Resources/blob/main/group_project_resources/flask-sqlalchemy-quickref.md

    def to_dict(self):
        return {
            'id': self.id,
            'auctionName': self.auctionName,
            'auctionDescription': self.auctionDescription,
            'auctionOpen': self.auctionOpen,
            'startingBidCents': self.startingBidCents,
            'finalBidCents': self.finalBidCents,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
            'startTime': self.startTime,
            'endTime': self.endTime,
            'auctionItemId': self.auctionItemId,
            'sellerId': self.sellerId,
            #does this work?
            'bids': self.bids

        }
