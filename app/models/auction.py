from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime



class Auction(db.Model):
    __tablename__ = 'auctions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    auctionName = db.Column(db.Text, nullable=False)
    auctionDescription = db.Column(db.Text, default="No description provided")
    auctionOpen = db.Column(db.Boolean, default=True)

    startingBidCents = db.Column(db.Integer, nullable=False, default=1)
    finalBidCents = db.Column(db.Integer, nullable=False, default=1)


    createdAt = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    startTime = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    endTime = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)



    #relationships, foreign keys
    auctionItemId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("items.id")))
    auctionItem = db.relationship("Item", back_populates="auctions")
    #auction item relationship
    sellerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    seller = db.relationship("User", back_populates="auctions")
    #seller relationship
    # bidId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("bid.id")))
    bids = db.relationship("Bid", back_populates="auctions")


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
