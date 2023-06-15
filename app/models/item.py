from .db import db, environment, SCHEMA, add_prefix_for_prod



class Item(db.Model):
    __tablename__ = 'items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default="No description provided")
    # lastKnownPrice = db.Column(db.Float(2))
    lastKnownPriceCents = db.Column(db.Integer, nullable=False)
    imageUrl = db.Column(db.Text, default="No image URL provided")

    ownerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    owner = db.relationship("User", back_populates="items")

    #https://github.com/appacademy/Module-6-Resources/blob/main/group_project_resources/flask-sqlalchemy-quickref.md

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'lastKnownPriceCents': self.lastKnownPriceCents,
            'imageUrl': self.imageUrl,
            'ownerId' : self.ownerId
        }
