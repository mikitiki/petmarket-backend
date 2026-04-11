from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import db
from .models import SpecialistProfile

specialists_bp = Blueprint('specialists', __name__)


@specialists_bp.route('/', methods=['GET'])
def list_specialists():
    query = SpecialistProfile.query

    city = request.args.get('city')
    spec = request.args.get('specialization')

    if city:
        query = query.filter(SpecialistProfile.city.ilike(f'%{city}%'))
    if spec:
        query = query.filter(SpecialistProfile.specialization.ilike(f'%{spec}%'))

    specialists = query.all()

    return jsonify([{
        'id': s.id,
        'name': s.name,
        'city': s.city,
        'specialization': s.specialization,
        'bio': s.bio
    } for s in specialists]), 200


@specialists_bp.route('/<int:specialist_id>', methods=['GET'])
def get_specialist(specialist_id):
    s = SpecialistProfile.query.get_or_404(specialist_id)
    return jsonify({
        'id': s.id,
        'name': s.name,
        'city': s.city,
        'specialization': s.specialization,
        'bio': s.bio
    }), 200


@specialists_bp.route('/', methods=['POST'])
@jwt_required()
def create_profile():
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Tylko specjalista moze tworzyc profil'}), 403

    user_id = int(get_jwt_identity())

    if SpecialistProfile.query.filter_by(user_id=user_id).first():
        return jsonify({'error': 'Profil juz istnieje, uzyj PUT'}), 409

    data = request.get_json()
    profile = SpecialistProfile(
        user_id=user_id,
        name=data.get('name', ''),
        city=data.get('city', ''),
        specialization=data.get('specialization', ''),
        bio=data.get('bio', '')
    )
    db.session.add(profile)
    db.session.commit()
    return jsonify({'message': 'Profil utworzony', 'id': profile.id}), 201


@specialists_bp.route('/<int:specialist_id>', methods=['PUT'])
@jwt_required()
def update_profile(specialist_id):
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Brak uprawnien'}), 403

    user_id = int(get_jwt_identity())
    profile = SpecialistProfile.query.get_or_404(specialist_id)

    if profile.user_id != user_id:
        return jsonify({'error': 'To nie jest Twoj profil'}), 403

    data = request.get_json()
    if 'name' in data: profile.name = data['name']
    if 'city' in data: profile.city = data['city']
    if 'specialization' in data: profile.specialization = data['specialization']
    if 'bio' in data: profile.bio = data['bio']

    db.session.commit()
    return jsonify({'message': 'Profil zaktualizowany'}), 200