from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
#, DateTimeField
#from wtforms.validators import DataRequired, ValidationError

#from datetime import datetime

class updateAuctionForm(FlaskForm):
    auctionName = StringField("auctionName")
    auctionDescription = StringField("auctionDescription")
   #auctionItemId = IntegerField("auctionItemId")

    #sellerId
    startingBidCents = IntegerField("startingBidCents")
    startTime = StringField("startTime")
    endTime = StringField("startTime")


    # 'endTime': self.endTime,
    # 'auctionItemId': self.auctionItemId,
    # 'sellerId': self.sellerId,
    # 'createdAt': self.createdAt,
    # 'updatedAt': self.updatedAt,
    # 'auctionOpen': self.auctionOpen,
    # 'finalBidCents': self.finalBidCents,
