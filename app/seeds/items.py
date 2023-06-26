from app.models import db, Item, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_items():

    demo_user_ref = User.query.filter(User.username == "Demo").first()
    demo_user_2 = User.query.filter(User.username == "marnie").first()
    #User.query.get(2)
    demo_user_3 = User.query.filter(User.username == "bobbie").first()

    item_random_vase = Item(
            name = "18th Century Vase",
            description = "This is a 18th Century Vase.... from somewhere",
            lastKnownPriceCents = 50000, #so, $500
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/VASE_1_resized.jpg",

            owner = demo_user_ref #hopefully this works
            )

    item_moonlight_greatsword = Item(
            name = "Moonlight Greatsword (Dark Souls)",
            description = "This sword, one of the rare dragon weapons, came from the tail of Seath the Scaleless, the pale white dragon who betrayed his own. Seath is the grandfather of sorcery, and this sword is imbued with his magic, which shall be unleashed as a wave of moonlight.",
            lastKnownPriceCents = 10000000, #so, $100,000
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/darkmoon_gs.png",

            owner = demo_user_ref #hopefully this works
            )

    item_star_rod = Item(
            name = "Star Rod (Kirby Series)",
            description = "The Star Rod is a legendary item that acts as the power source of the Fountain of Dreams. Kirby wields it as a weapon during his battle with Nightmare at the end of Kirby's Adventure and its remake, Kirby: Nightmare in Dream Land.",
            lastKnownPriceCents = 8800000, #so, $88,000
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/STAR_ROD_resized.jpg",

            owner = demo_user_ref #hopefully this works
            )
    doge_toast = Item(
            name = "Blessed Dog Toast",
            description = "The blessed dog toast is a result of a holy anomaly, nothing short of a miracle. The owner was making a normal breakfast, using a mundane, no-gimmick toaster, when the visage of their dear departed Shiba Inu caramelized itself onto the breaded surface. Take part in this miracle (with generous bids) today!",
            lastKnownPriceCents = 7777700, #so, $77,777
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/TOAST_1_resized.jpg",

            owner = demo_user_ref #hopefully this works
            )
    floating_clocks = Item(
            name = "Anti-Gravity Time Pieces",
            description = "These clocks defy gravity! Nobody knows why. If you ever win these, invest in some proper hardware to nail these suckers down!",
            lastKnownPriceCents = 12595900, #so, $77,777
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/ANTIQUE_1_resized.jpg",

            owner = demo_user_ref #hopefully this works
            )

    #for owner 2
    everything_key = Item(
            name = "Keys that Unlock Everything",
            description = "The Alberti and Trithemius are a pair of keys recovered from the depths of the Baltic, rumored to have the ability to dismantle any lock, no matter the build or complexity. (FBM Marketplace absolves itself from any crimes or wrongdoing committed with items obtained through its auctions)",
            lastKnownPriceCents = 12595900, #so, $77,777
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/ANTIQUE_2_resized.jpg",

            owner = demo_user_2 #hopefully this works
            )
    golden_spoon = Item(
            name = "Random trinkets and GOLDEN SPOON",
            description = "Have a random spool, a candle holder, a cup of Joe... and a GOLDEN SPOON with the ability to replicate any bite of food you remember, until time immemorial. World hunger is no more! Also have some coffee beans, on the house.",
            lastKnownPriceCents = 500,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/CHINA_1_resized.jpg",

            owner = demo_user_2 #hopefully this works
            )
    floating_coins = Item(
            name = "Plumber's Coins",
            description = "Another auction item with the mysterious ability to defy gravity. May have been used as monetary compensation for plumbing work.",
            lastKnownPriceCents = 10000,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/COINS_1_resized.jpg",

            owner = demo_user_2 #hopefully this works
            )
    guitar = Item(
            name = "The Lute of Us",
            description = "A monochromatic guitar symbolizing perseverance in the face of despair. The names of its previous two owners seem to be etched onto the bridge.",
            lastKnownPriceCents = 3771300,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/GUITAR_1_resized.jpg",

            owner = demo_user_2 #hopefully this works
            )
    knife = Item(
            name = "Edgy Boy",
            description = "This fancy knife has a serrated back, handle fortified with the coolest blue steel, and an edge that's sharper than your wit. Perfect for all your grass-cutting needs.",
            lastKnownPriceCents = 99900,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/KNIFE_1_resized.jpg",

            owner = demo_user_2 #hopefully this works
            )
    #owner 3
    hotel1 = Item(
            name = "Giant Hotel",
            description = "Enjoy this half hotel, half palace, ex-prison located off the coast of Miami. Seriously, take the entire thing. No strings attached.",
            lastKnownPriceCents = 750000,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/HOTEL_1_resized.jpg",

            owner = demo_user_3
            )
    hotel2 = Item(
            name = "Park Compound",
            description = "ABANDONED BEACH VACATION HOME SLASH RESEARCH SITE SLASH MILITARY COMPOUND. COMES WITH WATCHTOWER, SWIMMING POOL AND ANTI-BEHEMOTH ARTILERY SYSTEMS",
            lastKnownPriceCents = 1455000,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/HOTEL_2_resized.jpg",

            owner = demo_user_3
            )
    haunted_record = Item(
            name = "Innocuous Record Player",
            description = "This record player is haunted by the late Norm 'Al' Jenkovich. Enjoy an ethereal voice adding interpretive lyrics over your favorite instrumental songs",
            lastKnownPriceCents = 818100,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/RECORD_1_resized.jpg",

            owner = demo_user_3
            )
    couch_1 = Item(
            name = "Orange Couch",
            description = "Leather couch, very top heavy.",
            lastKnownPriceCents = 200000,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/SOFA_1_resized.jpg",

            owner = demo_user_3
            )
    couch_2 = Item(
            name = "White Couch",
            description = "Sofa consisting of the coldest white hue.",
            lastKnownPriceCents = 150000,
            imageUrl = "https://raw.githubusercontent.com/j1jlee/fbm-live-auction/main/images/SOFA_2_resized.jpg",

            owner = demo_user_3
            )




    db.session.add(item_random_vase)
    db.session.add(item_moonlight_greatsword)
    db.session.add(item_star_rod)
    db.session.add(doge_toast)
    db.session.add(floating_clocks)
    db.session.add(everything_key)
    db.session.add(golden_spoon)
    db.session.add(floating_coins)
    db.session.add(guitar)
    db.session.add(knife)
    db.session.add(hotel1)
    db.session.add(hotel2)
    db.session.add(haunted_record)
    db.session.add(couch_1)
    db.session.add(couch_2)
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
