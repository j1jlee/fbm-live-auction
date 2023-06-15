from flask import Blueprint, request
from flask_login import login_required
from app.models import db, Item

from app.forms.create_item_form import createItemForm
from app.forms.update_item_form import updateItemForm

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

@item_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_single_item(id):
    item = Item.query.get(id)

    if item is None:
        #syntax for returning 404??
        return {"error": f"Item {id} not found for delete"}, 404
    item_name = item.name

    db.session.delete(item)
    db.session.commit()

    return {"message": f"Item {item_name} successfully deleted"}

@item_routes.route('/<int:id>', methods=["UPDATE"])
@login_required
def update_single_item(id):

    print("At update item flask route")
    #edit this
    form = updateItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # print("request data", request.data)
    edit_item = Item.query.get(id)
    if edit_item is None:
        return {"error": f"Item {id} not found to edit"}, 404

    if form.validate_on_submit():
        data = form.data
        if data['name']:
            print(f"Changing item name from {edit_item['name']} to data['name']")
            edit_item['name'] = data['name']
        if data['desription']:
            print(f"Changing item desription from {edit_item['desription']} to data['desription']")
            edit_item['desription'] = data['desription']
        if data['imageUrl']:
            print(f"Changing item imageUrl from {edit_item['imageUrl']} to data['imageUrl']")
            edit_item['imageUrl'] = data['imageUrl']


         #lastKnownPriceCents should NOT be changeable
         #ownerId should NOT be manually changeable

        # new_item = Item(
        #     name = data['name'],
        #     description = data['description'],
        #     lastKnownPriceCents = data['lastKnownPriceCents'],
        #     imageUrl = data['imageUrl'],
        #     ownerId = data['ownerId']
        db.session.commit()
        return edit_item.to_dict()

    return { "errors": "Unknown error in update item"}
    # if form.errors:
    #     return {"errors" : form.errors}





@item_routes.route('/new', methods=["POST"])
@login_required
def post_new_item():
    form = createItemForm(csrf_enabled=True)


    # print("\n\n\nin post item route", request.cookies)

    # print("what about this?", request.get_json(force=True))

    # print("what is form dir?", dir(form))
    # # print("what is form[csrf-token]?", form["csrf-token"])
    # print("what is form[csrf-token]?", form['csrf-token'])
    # # print("does form have key 'csrf-token??", form.get_json(force=True))

    form['csrf_token'].data = request.cookies['csrf_token']
    #THE KEY IS CSRF_TOKEN, NOT CSRF-TOKEN

    if form.validate_on_submit():
        data = form.data
        new_item = Item(
            name = data['name'],
            description = data['description'],
            lastKnownPriceCents = data['lastKnownPriceCents'],
            imageUrl = data['imageUrl'],
            ownerId = data['ownerId']
        )

        db.session.add(new_item)
        db.session.commit()
        return new_item.to_dict()

    if form.errors:
        return {"errors" : form.errors}


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
