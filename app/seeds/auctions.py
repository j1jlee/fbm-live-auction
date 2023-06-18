from app.models import db, Auction, User, Item, environment, SCHEMA
from sqlalchemy.sql import text

from datetime import datetime


def seed_auctions():

    demo_user_ref = User.query.filter(User.username == "Demo").first()

    auction_item_ref = Item.query.filter(Item.name.like("%18th Century%")).first()

    auction_test = Auction(
        auctionName = "First Test Auction",
        auctionDescription = "We're selling only the rarest of items today!",
        auctionOpen = True,

        startingBidCents = 50000,
        startTime = datetime.strptime("20/07/23 16:30", "%d/%m/%y %H:%M"),
        endTime = datetime.strptime("20/07/23 17:00", "%d/%m/%y %H:%M"),
        #finalBidCents, createdAt, updatedAt, all default

        auctionItem = auction_item_ref,
        seller = demo_user_ref
    )



    db.session.add(auction_test)
    db.session.commit()


def undo_auctions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.auctions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM auctions"))

    db.session.commit()
