from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import db
from .models import Booking, SpecialistProfile, User

bookings_bp = Blueprint('bookings', __name__)


# ──────────────────────────────────────────────────────────────
# POST /bookings  — właściciel tworzy rezerwację
# ──────────────────────────────────────────────────────────────
@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    claims = get_jwt()
    if claims.get('role') != 'owner':
        return jsonify({'error': 'Tylko właściciel może tworzyć rezerwacje'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Brak danych'}), 400

    specialist_id = data.get('specialist_id')
    date = data.get('date')
    time = data.get('time')

    if not specialist_id or not date or not time:
        return jsonify({'error': 'Podaj specialist_id, date i time'}), 400

    # Sprawdź czy specjalista istnieje
    specialist = SpecialistProfile.query.get(specialist_id)
    if not specialist:
        return jsonify({'error': 'Specjalista nie istnieje'}), 404

    owner_id = int(get_jwt_identity())

    # Zapobiegaj podwójnej rezerwacji tego samego terminu u tego specjalisty
    existing = Booking.query.filter_by(
        specialist_id=specialist_id,
        date=date,
        time=time
    ).filter(Booking.status != 'anulowana').first()

    if existing:
        return jsonify({'error': 'Ten termin jest już zajęty'}), 409

    booking = Booking(
        owner_id=owner_id,
        specialist_id=specialist_id,
        date=date,
        time=time,
        status='oczekująca'
    )
    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'message': 'Rezerwacja utworzona',
        'id': booking.id,
        'status': booking.status
    }), 201


# ──────────────────────────────────────────────────────────────
# GET /bookings/me  — lista rezerwacji zalogowanego użytkownika
# ──────────────────────────────────────────────────────────────
@bookings_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_bookings():
    claims = get_jwt()
    user_id = int(get_jwt_identity())
    role = claims.get('role')

    if role == 'owner':
        # Właściciel widzi swoje rezerwacje + nazwę specjalisty
        bookings = Booking.query.filter_by(owner_id=user_id).order_by(Booking.date, Booking.time).all()
        result = []
        for b in bookings:
            result.append({
                'id': b.id,
                'specialist_id': b.specialist_id,
                'specialist_name': b.specialist.name if b.specialist else 'Nieznany',
                'date': b.date,
                'time': b.time,
                'status': b.status,
            })
        return jsonify(result), 200

    elif role == 'specialist':
        # Specjalista widzi rezerwacje do swojego profilu + email właściciela
        profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify([]), 200

        bookings = Booking.query.filter_by(specialist_id=profile.id).order_by(Booking.date, Booking.time).all()
        result = []
        for b in bookings:
            owner = User.query.get(b.owner_id)
            result.append({
                'id': b.id,
                'owner_id': b.owner_id,
                'owner_email': owner.email if owner else 'Nieznany',
                'date': b.date,
                'time': b.time,
                'status': b.status,
            })
        return jsonify(result), 200

    return jsonify({'error': 'Nieznana rola'}), 400


# ──────────────────────────────────────────────────────────────
# DELETE /bookings/<id>  — właściciel anuluje swoją rezerwację
# ──────────────────────────────────────────────────────────────
@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    claims = get_jwt()
    if claims.get('role') != 'owner':
        return jsonify({'error': 'Tylko właściciel może anulować rezerwację'}), 403

    user_id = int(get_jwt_identity())
    booking = Booking.query.get_or_404(booking_id)

    if booking.owner_id != user_id:
        return jsonify({'error': 'To nie jest Twoja rezerwacja'}), 403

    if booking.status == 'anulowana':
        return jsonify({'error': 'Rezerwacja jest już anulowana'}), 400

    booking.status = 'anulowana'
    db.session.commit()

    return jsonify({'message': 'Rezerwacja anulowana'}), 200


# ──────────────────────────────────────────────────────────────
# PATCH /bookings/<id>/status  — specjalista zatwierdza / odrzuca
# ──────────────────────────────────────────────────────────────
@bookings_bp.route('/<int:booking_id>/status', methods=['PATCH'])
@jwt_required()
def update_booking_status(booking_id):
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Tylko specjalista może zmieniać status rezerwacji'}), 403

    user_id = int(get_jwt_identity())
    booking = Booking.query.get_or_404(booking_id)

    # Sprawdź czy rezerwacja należy do tego specjalisty
    profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
    if not profile or booking.specialist_id != profile.id:
        return jsonify({'error': 'Brak uprawnień do tej rezerwacji'}), 403

    data = request.get_json()
    new_status = data.get('status') if data else None

    allowed = ['potwierdzona', 'anulowana']
    if new_status not in allowed:
        return jsonify({'error': f'Status musi być jednym z: {allowed}'}), 400

    booking.status = new_status
    db.session.commit()

    return jsonify({'message': f'Status zmieniony na {new_status}'}), 200
