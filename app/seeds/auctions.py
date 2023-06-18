from app.models import db, Item, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_items():

    demo_user_ref = User.query.filter(User.username == "Demo").first()

    item_random_vase = Item(
            name = "18th Century Vase",
            description = "This is a 18th Century Vase.... from somewhere",
            lastKnownPriceCents = 50000, #so, $500
            imageUrl = "defaultImage.png",

            owner = demo_user_ref #hopefully this works
            )

    item_moonlight_greatsword = Item(
            name = "Moonlight Greatsword (Dark Souls)",
            description = "This sword, one of the rare dragon weapons, came from the tail of Seath the Scaleless, the pale white dragon who betrayed his own. Seath is the grandfather of sorcery, and this sword is imbued with his magic, which shall be unleashed as a wave of moonlight.",
            lastKnownPriceCents = 10000000, #so, $100,000
            imageUrl = "defaultImage.png",

            owner = demo_user_ref #hopefully this works
            )

    item_star_rod = Item(
            name = "Star Rod (Kirby Series)",
            description = "The Star Rod is a legendary item that acts as the power source of the Fountain of Dreams. Kirby wields it as a weapon during his battle with Nightmare at the end of Kirby's Adventure and its remake, Kirby: Nightmare in Dream Land.",
            lastKnownPriceCents = 7777700, #so, $77,777
            imageUrl = "defaultImage.png",

            owner = demo_user_ref #hopefully this works
            )


    db.session.add(item_random_vase)
    db.session.add(item_moonlight_greatsword)
    db.session.add(item_star_rod)
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
