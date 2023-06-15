from flask_wtf import FlaskForm
from wtforms import StringField
# from wtforms.validators import DataRequired, ValidationError
# from app.models import Item

class updateItemForm(FlaskForm):
    name = StringField("name")
    description = StringField("description")
    imageUrl = StringField("imageUrl")
