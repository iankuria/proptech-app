from app import app
from database import db
from models import Landlord, Property, Seeker, SavedProperty, Review

with app.app_context():
    db.drop_all()
    db.create_all()

    print("Seeding...")

    l1 = Landlord(name="James Mwangi", email="james@realty.co.ke", phone="0712345678")
    l2 = Landlord(name="Amina Hassan", email="amina@listings.co.ke", phone="0723456789")
    db.session.add_all([l1, l2])
    db.session.commit()

    p1 = Property(title="Modern 3-Bedroom Apartment", description="A spacious modern apartment in the heart of Westlands with open-plan living and 24hr security.", price=85000.0, city="Nairobi", estate="Westlands", image_url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", landlord_id=l1.id)
    p2 = Property(title="Cosy 2-Bedroom Bungalow", description="A charming bungalow with a large garden, ideal for a small family near schools and shopping centres.", price=55000.0, city="Nairobi", estate="Karen", image_url="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", landlord_id=l1.id)
    p3 = Property(title="Studio Apartment – City Centre", description="A compact and affordable studio apartment perfect for young professionals near CBD offices.", price=25000.0, city="Nairobi", estate="CBD", image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", landlord_id=l2.id)
    p4 = Property(title="Luxury 4-Bedroom Villa", description="An executive villa with a private pool and beautifully landscaped gardens in a gated community.", price=250000.0, city="Nairobi", estate="Runda", image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", landlord_id=l2.id)
    db.session.add_all([p1, p2, p3, p4])
    db.session.commit()

    db.session.add_all([
        Review(rating=5, comment="Absolutely loved the apartment. Very clean and well managed.", reviewer_name="Kevin O.", property_id=p1.id),
        Review(rating=4, comment="Great location and friendly landlord. Would recommend.", reviewer_name="Fatuma A.", property_id=p1.id),
        Review(rating=3, comment="Nice bungalow but the garden needs some work.", reviewer_name="Paul N.", property_id=p2.id),
    ])

    s1 = Seeker(name="Linda Njoroge", email="linda@gmail.com")
    s2 = Seeker(name="Tom Otieno", email="tom@gmail.com")
    db.session.add_all([s1, s2])
    db.session.commit()

    db.session.add_all([
        SavedProperty(seeker_id=s1.id, property_id=p1.id, note="Top choice – fits my budget"),
        SavedProperty(seeker_id=s2.id, property_id=p4.id, note="Dream home – saving up"),
    ])
    db.session.commit()

    print("Done!")