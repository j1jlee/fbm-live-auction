from flask import Blueprint, request
from flask_login import login_required
from app.models import db, Item

from app.forms.create_item_form import createItemForm
from app.forms.update_item_form import updateItemForm
from app.forms.trade_item_form import tradeItemForm

from app.aws_middleware import (
    upload_file_to_s3, allowed_file, get_unique_filename)

from app.aws_middleware import delete_file_s3
from app.forms.aws_test_form import awsTestForm


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

@item_routes.route('/<int:id>/trade', methods=["PUT"])
@login_required
def trade_item(id):
    form = tradeItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    trade_item = Item.query.get(id)

    if trade_item is None:
        return {"error": f"Item {id} not found to trade"}, 404

    if form.validate_on_submit():
        data = form.data
        trade_item.lastKnownPriceCents = data['lastKnownPriceCents']
        trade_item.ownerId = data['ownerId']

        db.session.commit()
        return trade_item.to_dict()

    return { "errors": "Unknown error in trade item"}



@item_routes.route('/<int:id>', methods=["PUT"])
# @item_routes.route('/<int:id>', methods=["UPDATE"])
@login_required
def update_single_item(id):

    print("\n\n\nAt update item flask route")
    print("getting id>>", id)
    #edit this
    form = updateItemForm()

    print("at form")

    form['csrf_token'].data = request.cookies['csrf_token']
    print("form data csrf token")

    # print("request data", request.data)
    edit_item = Item.query.get(id)
    if edit_item is None:
        return {"error": f"Item {id} not found to edit"}, 404

    print("\n\n\nChanging: ")

    # edit_item = edit_item.to_dict()

    if form.validate_on_submit():
        data = form.data
        if data['name']:
            print(f"Changing item name from {edit_item.name} to {data['name']}")
            edit_item.name = data['name']
        if data['description']:
            print(f"Changing item description from {edit_item.description} to {data['description']}")
            edit_item.description = data['description']
        if data['imageUrl']:
            print(f"Changing item imageUrl from {edit_item.imageUrl} to {data['imageUrl']}")
            edit_item.imageUrl = data['imageUrl']
        # if data['name']:
        #     print(f"Changing item name from {edit_item['name']} to data['name']")
        #     edit_item['name'] = data['name']
        # if data['description']:
        #     print(f"Changing item description from {edit_item['description']} to data['description']")
        #     edit_item['description'] = data['description']
        # if data['imageUrl']:
        #     print(f"Changing item imageUrl from {edit_item['imageUrl']} to data['imageUrl']")
        #     edit_item['imageUrl'] = data['imageUrl']


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

    # try:
    #     print('\n\n\n\request.files?', request.files.args)
    # except:
    #     print('\n\n\nno request files? request?', request)

    # image = request.files["image"]

    # if image:
    #     print('image', image)

    print("\n\n\nbackend 1: form validation")
    if form.validate_on_submit():

        print("\n\n\nbackend 1: form validated")
        data = form.data

        # try:
        #     print("\n\n\n\ndoes image come out of form??", data['image'])
        # except:
        #     print("image doesn't come out of from i guess", data)

        #image handling first

        uploadImageUrl = ''

        if data['image']:

            print("\n\n\nbackend 2: image?")
            image = data['image']

            print("\n\n\nbackend 2: image:", image)

            if not allowed_file(image.filename):

                print("\n\n\nbackend 2b: filetype not permitted, exiting")

                form.errors['image_backend'] = "Image filetype not permitted"
                return {"errors" : form.errors}, 400


            print("\n\n\nbackend 3: pre-unique filename")

            temp_filename = get_unique_filename(image.filename)
            image.filename = temp_filename


            print("\n\n\nbackend 3: unique filename", image.filename)

            print("\n\n\nbackend 4: pre-upload", image)
            upload = upload_file_to_s3(image)

            print("\n\n\nbackend 4: upload successful?", upload)

            try:
                if upload['errors']:
                    print("upload['errors], exiting early")
                    print(upload['errors'])

                    form.errors['upload_file_to_s3'] = upload['errors']
                    return { "errors" : form.errors}, 400
            except Exception as e:
                print("Errors keying into upload['errors']?", e)
                pass

            if "url" not in upload:
                # if the dictionary doesn't have a url key
                # it means that there was an error when we tried to upload
                # so we send back that error message
                return upload, 400

            uploadImageUrl = upload['url']

        else:
            print("\n\n\nbackend 4b: skipping all that, data.image doesn't exist, taking imageUrl", data['imageUrl'])

            uploadImageUrl = data['imageUrl']


        new_item = Item(
            name = data['name'],
            description = data['description'],
            lastKnownPriceCents = data['lastKnownPriceCents'],
            imageUrl = uploadImageUrl,
            # imageUrl = data['imageUrl'],
            ownerId = data['ownerId']
        )

        db.session.add(new_item)
        db.session.commit()
        return new_item.to_dict()

    if form.errors:
        return {"errors" : form.errors}, 400


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

@item_routes.route('/aws_delete_test', methods=["POST"])
def item_aws_delete_test():
    print("at AWS delete test, ")

    # form = awsTestForm()
    form = awsTestForm(csrf_enabled=True)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        bTestInput = data['testInput']

        print("\n\n\nbTestINput???", bTestInput)

        try:
            deleteAttempt = delete_file_s3(bTestInput)
            print(deleteAttempt)
            return "backend AWS delete successful"
        except Exception as e:
            print(f"some errors, {e}")
            return e


    if form.errors:
        return {"errors" : form.errors}, 400
