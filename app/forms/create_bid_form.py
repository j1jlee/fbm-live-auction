from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
# from app.models import Item

class createBidForm(FlaskForm):
    auctionId = IntegerField("auctionId")
    bidderId = IntegerField("bidderId")
    timeOfBid = StringField("timeOfBid")
    bidAmountCents = IntegerField("bidAmountCents")
