from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from database import db
from models import Landlord, Property, Seeker, SavedProperty, Review

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///proptech.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

@app.route("/")
def index():
    return jsonify({"message": "PropTech API is running ✅"})

db.init_app(app)

with app.app_context():
    db.create_all()


def validation_error(message, status=422):
    return make_response(jsonify({"error": message}), status)


# ── Properties ──────────────────────────────────────────

@app.route("/properties", methods=["GET"])
def get_properties():
    city = request.args.get("city")
    estate = request.args.get("estate")
    title = request.args.get("title")
    query = Property.query
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if estate:
        query = query.filter(Property.estate.ilike(f"%{estate}%"))
    if title:
        query = query.filter(Property.title.ilike(f"%{title}%"))
    return jsonify([p.to_dict() for p in query.all()]), 200


@app.route("/properties/<int:id>", methods=["GET"])
def get_property(id):
    return jsonify(Property.query.get_or_404(id).to_dict()), 200


@app.route("/properties", methods=["POST"])
def create_property():
    data = request.get_json()
    for field in ["title", "description", "price", "city", "estate", "landlord_id"]:
        if not data.get(field):
            return validation_error(f"'{field}' is required.")
    if not isinstance(data["price"], (int, float)) or data["price"] <= 0:
        return validation_error("'price' must be a positive number.")
    if len(data["title"]) < 5:
        return validation_error("'title' must be at least 5 characters.")
    if len(data["description"]) < 20:
        return validation_error("'description' must be at least 20 characters.")
    if not Landlord.query.get(data["landlord_id"]):
        return validation_error("Landlord not found.", 404)
    p = Property(
        title=data["title"], description=data["description"],
        price=data["price"], city=data["city"], estate=data["estate"],
        image_url=data.get("image_url", ""), landlord_id=data["landlord_id"],
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201


@app.route("/properties/<int:id>", methods=["PATCH"])
def update_property(id):
    p = Property.query.get_or_404(id)
    data = request.get_json()
    if "price" in data:
        if not isinstance(data["price"], (int, float)) or data["price"] <= 0:
            return validation_error("'price' must be a positive number.")
        p.price = data["price"]
    if "title" in data:
        p.title = data["title"]
    if "description" in data:
        p.description = data["description"]
    if "city" in data:
        p.city = data["city"]
    if "estate" in data:
        p.estate = data["estate"]
    if "image_url" in data:
        p.image_url = data["image_url"]
    db.session.commit()
    return jsonify(p.to_dict()), 200


@app.route("/properties/<int:id>", methods=["DELETE"])
def delete_property(id):
    p = Property.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"message": f"Property '{p.title}' deleted."}), 200


# ── Landlords ────────────────────────────────────────────

@app.route("/landlords", methods=["GET"])
def get_landlords():
    return jsonify([l.to_dict() for l in Landlord.query.all()]), 200


@app.route("/landlords/<int:id>", methods=["GET"])
def get_landlord(id):
    return jsonify(Landlord.query.get_or_404(id).to_dict()), 200


@app.route("/landlords", methods=["POST"])
def create_landlord():
    data = request.get_json()
    for field in ["name", "email", "phone"]:
        if not data.get(field):
            return validation_error(f"'{field}' is required.")
    if "@" not in data["email"]:
        return validation_error("A valid email is required.")
    if not data["phone"].isdigit() or len(data["phone"]) < 10:
        return validation_error("Phone must be digits only, at least 10 characters.")
    if Landlord.query.filter_by(email=data["email"]).first():
        return validation_error("A landlord with this email already exists.")
    l = Landlord(name=data["name"], email=data["email"], phone=data["phone"])
    db.session.add(l)
    db.session.commit()
    return jsonify(l.to_dict()), 201


@app.route("/landlords/<int:id>", methods=["PATCH"])
def update_landlord(id):
    l = Landlord.query.get_or_404(id)
    data = request.get_json()
    if "name" in data: l.name = data["name"]
    if "phone" in data: l.phone = data["phone"]
    if "email" in data: l.email = data["email"]
    db.session.commit()
    return jsonify(l.to_dict()), 200


@app.route("/landlords/<int:id>", methods=["DELETE"])
def delete_landlord(id):
    l = Landlord.query.get_or_404(id)
    db.session.delete(l)
    db.session.commit()
    return jsonify({"message": f"Landlord '{l.name}' deleted."}), 200


# ── Seekers ──────────────────────────────────────────────

@app.route("/seekers", methods=["GET"])
def get_seekers():
    return jsonify([s.to_dict() for s in Seeker.query.all()]), 200


@app.route("/seekers/<int:id>", methods=["GET"])
def get_seeker(id):
    return jsonify(Seeker.query.get_or_404(id).to_dict()), 200


@app.route("/seekers", methods=["POST"])
def create_seeker():
    data = request.get_json()
    if not data.get("name"): return validation_error("'name' is required.")
    if not data.get("email"): return validation_error("'email' is required.")
    if "@" not in data["email"]: return validation_error("A valid email is required.")
    if Seeker.query.filter_by(email=data["email"]).first():
        return validation_error("A seeker with this email already exists.")
    s = Seeker(name=data["name"], email=data["email"])
    db.session.add(s)
    db.session.commit()
    return jsonify(s.to_dict()), 201


# ── Saved Properties ─────────────────────────────────────

@app.route("/saved_properties", methods=["GET"])
def get_saved_properties():
    return jsonify([sp.to_dict() for sp in SavedProperty.query.all()]), 200


@app.route("/saved_properties", methods=["POST"])
def save_property():
    data = request.get_json()
    if not data.get("seeker_id"): return validation_error("'seeker_id' is required.")
    if not data.get("property_id"): return validation_error("'property_id' is required.")
    if not Seeker.query.get(data["seeker_id"]): return validation_error("Seeker not found.", 404)
    if not Property.query.get(data["property_id"]): return validation_error("Property not found.", 404)
    existing = SavedProperty.query.filter_by(seeker_id=data["seeker_id"], property_id=data["property_id"]).first()
    if existing: return validation_error("Property already saved by this seeker.")
    sp = SavedProperty(seeker_id=data["seeker_id"], property_id=data["property_id"], note=data.get("note", ""))
    db.session.add(sp)
    db.session.commit()
    return jsonify(sp.to_dict()), 201


@app.route("/saved_properties/<int:id>", methods=["DELETE"])
def unsave_property(id):
    sp = SavedProperty.query.get_or_404(id)
    db.session.delete(sp)
    db.session.commit()
    return jsonify({"message": "Property removed from saved list."}), 200


# ── Reviews ──────────────────────────────────────────────

@app.route("/reviews", methods=["GET"])
def get_reviews():
    return jsonify([r.to_dict() for r in Review.query.all()]), 200


@app.route("/properties/<int:property_id>/reviews", methods=["GET"])
def get_property_reviews(property_id):
    Property.query.get_or_404(property_id)
    return jsonify([r.to_dict() for r in Review.query.filter_by(property_id=property_id).all()]), 200


@app.route("/reviews", methods=["POST"])
def create_review():
    data = request.get_json()
    for field in ["rating", "comment", "reviewer_name", "property_id"]:
        if data.get(field) is None:
            return validation_error(f"'{field}' is required.")
    if not isinstance(data["rating"], int) or not (1 <= data["rating"] <= 5):
        return validation_error("'rating' must be an integer between 1 and 5.")
    if len(data["comment"]) < 10:
        return validation_error("'comment' must be at least 10 characters.")
    if not Property.query.get(data["property_id"]):
        return validation_error("Property not found.", 404)
    r = Review(rating=data["rating"], comment=data["comment"],
               reviewer_name=data["reviewer_name"], property_id=data["property_id"])
    db.session.add(r)
    db.session.commit()
    return jsonify(r.to_dict()), 201


@app.route("/reviews/<int:id>", methods=["DELETE"])
def delete_review(id):
    r = Review.query.get_or_404(id)
    db.session.delete(r)
    db.session.commit()
    return jsonify({"message": "Review deleted."}), 200


# if __name__ == "__main__":
#     app.run(debug=True, port=5555)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5555))
    app.run(host="0.0.0.0", port=port, debug=False)