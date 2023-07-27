from flask_wtf import FlaskForm
from wtforms import StringField
# from wtforms import StringField, IntegerField, DateTimeField
# from wtforms.validators import DataRequired, ValidationError


class awsTestForm(FlaskForm):
    testInput = StringField("testInput")

