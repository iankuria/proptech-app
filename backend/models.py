from database import db
from datetime import datetime


class Landlord(db.Model):
    __tablename__ = "landlords"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    properties = db.relationship("Property", back_populates="landlord", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
            "properties": [p.to_dict(include_landlord=False) for p in self.properties],
        }


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    estate = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    landlord_id = db.Column(db.Integer, db.ForeignKey("landlords.id"), nullable=False)
    landlord = db.relationship("Landlord", back_populates="properties")

    reviews = db.relationship("Review", back_populates="property", cascade="all, delete-orphan")
    saved_by = db.relationship("SavedProperty", back_populates="property", cascade="all, delete-orphan")

    def to_dict(self, include_landlord=True):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "city": self.city,
            "estate": self.estate,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat(),
            "landlord_id": self.landlord_id,
            "reviews": [r.to_dict() for r in self.reviews],
        }
        if include_landlord and self.landlord:
            data["landlord"] = {"id": self.landlord.id, "name": self.landlord.name}
        return data


class Seeker(db.Model):
    __tablename__ = "seekers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    saved_properties = db.relationship("SavedProperty", back_populates="seeker", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "saved_properties": [sp.to_dict(include_seeker=False) for sp in self.saved_properties],
        }


class SavedProperty(db.Model):
    __tablename__ = "saved_properties"

    id = db.Column(db.Integer, primary_key=True)
    seeker_id = db.Column(db.Integer, db.ForeignKey("seekers.id"), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    note = db.Column(db.String(255), nullable=True)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    seeker = db.relationship("Seeker", back_populates="saved_properties")
    property = db.relationship("Property", back_populates="saved_by")

    def to_dict(self, include_seeker=True):
        data = {
            "id": self.id,
            "seeker_id": self.seeker_id,
            "property_id": self.property_id,
            "note": self.note,
            "saved_at": self.saved_at.isoformat(),
        }
        if include_seeker and self.seeker:
            data["seeker"] = {"id": self.seeker.id, "name": self.seeker.name}
        if self.property:
            data["property"] = {"id": self.property.id, "title": self.property.title}
        return data


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    reviewer_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    property = db.relationship("Property", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "reviewer_name": self.reviewer_name,
            "property_id": self.property_id,
            "created_at": self.created_at.isoformat(),
        }