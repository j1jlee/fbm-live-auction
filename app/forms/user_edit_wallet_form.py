from flask_wtf import FlaskForm
from wtforms import IntegerField
# from wtforms.validators import DataRequired, ValidationError
# from app.models import Item

class userEditWalletForm(FlaskForm):
    newCashCents = IntegerField("newCashCents")
