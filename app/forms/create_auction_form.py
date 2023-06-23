from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateTimeField
from wtforms.validators import DataRequired, ValidationError

from datetime import datetime
# from app.models import Item

# def dateTimeValidator():
#     currentDateTime = datetime.utcnow()
#     pass

class createAuctionForm(FlaskForm):
    auctionName = StringField("auctionName")
    auctionDescription = StringField("auctionDescription")
    auctionItemId = IntegerField("auctionItemId")
        #select in frontend
    sellerId = IntegerField("sellerId")
    startingBidCents = IntegerField("startingBidCents")
    # startTime = DateTimeField("startTime")
    # endTime = DateTimeField("startTime")
    startTime = StringField("startTime")
    endTime = StringField("startTime")


    # 'endTime': self.endTime,
    # 'auctionItemId': self.auctionItemId,
    # 'sellerId': self.sellerId,
    # 'createdAt': self.createdAt,
    # 'updatedAt': self.updatedAt,
    # 'auctionOpen': self.auctionOpen,
    # 'finalBidCents': self.finalBidCents,

"""             'id': self.id,
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
            'sellerId': self.sellerId, """
