from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import db, User

from app.forms.user_edit_wallet_form import userEditWalletForm


user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/wallet', methods=["PUT"])
@login_required
def userEditWallet(id):
    """
    Update user Wallet with posted amount
    """

    print("\n\n\nAt wallet update")
    user = User.query.get(id)

    print("1. user?", user)


    if user is None:
        return {"error": f"User {id} not found"}, 404

    #userCashCents = user['cashCents']

    form = userEditWalletForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        newCashCents = data['newCashCents']

        print("2. newCashCents?", newCashCents)

        print("3a. user cashCents before?", user.cashCents)

        user.cashCents += newCashCents

        print("3b. user cashCents updated?", user.cashCents)


        db.session.commit()
        return user.to_dict()


    return { "errors": "Unknown error in edit wallet"}
