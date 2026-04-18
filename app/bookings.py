from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import db
from .models import Booking, SpecialistProfile

bookings_bp = Blueprint('bookings', __name__)


@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    claims = get_jwt()
    if claims.get('role') != 'owner':
        return jsonify({'error': 'Tylko wlasciciel moze rezerwowac'}), 403

    owner_id = int(get_jwt_identity())
    data = request.get_json()

    if not data.get('specialist_id') or not data.get('date') or not data.get('time'):
        return jsonify({'error': 'Podaj specialist_id, date i time'}), 400

    booking = Booking(
        owner_id=owner_id,
        specialist_id=data['specialist_id'],
        date=data['date'],
        time=data['time']
    )
    db.session.add(booking)
    db.session.commit()

    return jsonify({'message': 'Rezerwacja utworzona', 'id': booking.id}), 201


@bookings_bp.route('/me', methods=['GET'])
@jwt_required()
def my_bookings():
    user_id = int(get_jwt_identity())
    claims = get_jwt()

    if claims.get('role') == 'owner':
        bookings = Booking.query.filter_by(owner_id=user_id).all()
    else:
        profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Nie masz profilu specjalisty'}), 404
        bookings = Booking.query.filter_by(specialist_id=profile.id).all()

    return jsonify([{
        'id': b.id,
        'specialist_id': b.specialist_id,
        'owner_id': b.owner_id,
        'date': b.date,
        'time': b.time,
        'status': b.status
    } for b in bookings]), 200


@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = int(get_jwt_identity())
    booking = Booking.query.get_or_404(booking_id)

    if booking.owner_id != user_id:
        return jsonify({'error': 'To nie jest Twoja rezerwacja'}), 403

    booking.status = 'cancelled'
    db.session.commit()

    return jsonify({'message': 'Rezerwacja anulowana'}), 200