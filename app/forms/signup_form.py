from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def custom_email(form, field):
    email_input = field.data


    email_split_at = email_input.split("@")

    if len(email_split_at) == 1:
        raise ValidationError("Email should include '@'")
    if (len(email_split_at[1]) == 0 or
        len(email_split_at[1].split('.')) == 1 or
        len(email_split_at[1].split('.')[0]) == 0 or
        len(email_split_at[1].split('.')[1]) == 0):
        raise ValidationError("Email should contain 'domain.TLD' after '@'")


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists, Length(min=1, max=40)])
    email = StringField('email', validators=[DataRequired(), user_exists, Length(min=5, max=255), custom_email])
    # email = StringField('email', validators=[DataRequired(), user_exists, Length(min=5, max=255), Email()])
    password = StringField('password', validators=[DataRequired(), Length(min=8, max=30)])

    firstname = StringField('firstname', validators=[DataRequired(), Length(min=1, max=20)])
    lastname = StringField('lastname', validators=[DataRequired(), Length(min=1, max=20)])

    cashCents = IntegerField('cashCents')
