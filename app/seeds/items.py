from app.models import db, Item, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_items():

    demo_user_ref = User.query.filter(User.username == "Demo").first()

    item1 = Item(
            name = "18th Century Vase",
            description = "This is a 18th Century Vase.... from somewhere",
            lastKnownPriceCents = 50000, #so, $500
            imageUrl = "defaultImage.png",

            owner = demo_user_ref #hopefully this works
            )

    db.session.add(item1)
    db.session.commit()

"""         id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="No description provided")
    lastKnownPriceCents = db.Column(db.Integer, nullable=False)
    imageUrl = db.Column(db.Text)

    ownerId = db.Column(db.Integer, db.ForeignKey("users.id"))
    owner = db.relationship("User", back_populates="items") """



def undo_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM items"))

    db.session.commit()
