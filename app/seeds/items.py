from app.models import db, Item, environment, SCHEMA
from sqlalchemy.sql import text


def seed_items():
    item1 = Item(
        

    db.session.add(bobbie)
    db.session.commit()

"""     id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="No description provided")
    # lastKnownPrice = db.Column(db.Float(2))
    lastKnownPriceCents = db.Column(db.Integer, nullable=False)
    imageUrl = db.Column(db.Text) """



def undo_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM items"))

    db.session.commit()
