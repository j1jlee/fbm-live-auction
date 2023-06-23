from flask_wtf import FlaskForm
from wtforms import BooleanField
# from wtforms import StringField, IntegerField
#, DateTimeField
#from wtforms.validators import DataRequired, ValidationError

#from datetime import datetime

class closeAuctionForm(FlaskForm):

    auctionOpen : BooleanField("auctionOpen")

    # 'endTime': self.endTime,
    # 'auctionItemId': self.auctionItemId,
    # 'sellerId': self.sellerId,
    # 'createdAt': self.createdAt,
    # 'updatedAt': self.updatedAt,
    # 'auctionOpen': self.auctionOpen,
    # 'finalBidCents': self.finalBidCents,
