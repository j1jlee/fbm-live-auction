from flask_wtf import FlaskForm
from wtforms import IntegerField
#, DateTimeField
#from wtforms.validators import DataRequired, ValidationError

#from datetime import datetime

class tradeItemForm(FlaskForm):
    lastKnownPriceCents = IntegerField("lastKnownPriceCents")
    ownerId = IntegerField("ownerId")
