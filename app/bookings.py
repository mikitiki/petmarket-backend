from flask import Blueprint, jsonify

bookings_bp = Blueprint('bookings', __name__)

# Osoba 2 wypelni te endpointy:
# POST   /api/bookings/    — stworz rezerwacje
# GET    /api/bookings/me  — moje rezerwacje
# DELETE /api/bookings/:id — anuluj rezerwacje