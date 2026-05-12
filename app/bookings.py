from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_bookings():
    user_id = get_jwt_identity()
    # TODO: Implement fetching bookings for the current user
    # For now, return empty list
    return jsonify([]), 200