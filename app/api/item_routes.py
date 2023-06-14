from flask import Blueprint, request
from flask_login import login_required
from app.models import Item

item_routes = Blueprint('items', __name__)


@item_routes.route('/')
# @login_required
def get_all_items():
    """
    Query for all items and returns them in a list of item dictionaries
    """
    items = Item.query.all()
    return {'items': [item.to_dict() for item in items]}


@item_routes.route('/<int:id>')
# @login_required
def get_single_item(id):
    """
    Query for a item by id and returns that item in a dictionary
    """
    item = Item.query.get(id)
    return item.to_dict()

@item_routes.route('/post_test', methods=["POST"])
# @login_required
def item_post_test():
    # print("attempting post test")
    # print("\n\n\ndiff inputs")
    # print("request.args", request.args)
    # print("request.form", request.form)
    # print("request.values", request.values)

    #remember to set Content-Type to "application/json"
    print("request.get_json()", request.get_json())
    post_data = (request.get_json(force=True))
    print(post_data)
    return {"message": post_data}
