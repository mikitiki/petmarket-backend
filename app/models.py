from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    profile = db.relationship('SpecialistProfile', backref='user', uselist=False)


class SpecialistProfile(db.Model):
    __tablename__ = 'specialist_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text, default='')
    photo_url = db.Column(db.String(255), default='')


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    specialist_id = db.Column(db.Integer, db.ForeignKey('specialist_profiles.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    specialist = db.relationship('SpecialistProfile', backref='bookings')
    owner = db.relationship('User', foreign_keys=[owner_id])

class Service(db.Model):
    __tablename__ = 'services'

    id             = db.Column(db.Integer, primary_key=True)
    specialist_id  = db.Column(db.Integer, db.ForeignKey('specialist_profiles.id'), nullable=False)
    name           = db.Column(db.String(100), nullable=False)
    description    = db.Column(db.Text, default='')
    price          = db.Column(db.Float, nullable=False)
    duration       = db.Column(db.Integer, default=60)

    specialist = db.relationship('SpecialistProfile', backref='services')
