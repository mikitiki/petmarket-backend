from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import db
from .models import Service, SpecialistProfile

services_bp = Blueprint('services', __name__)


@services_bp.route('/specialist/<int:specialist_id>', methods=['GET'])
def get_services(specialist_id):
    services = Service.query.filter_by(specialist_id=specialist_id).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'price': s.price,
        'duration': s.duration
    } for s in services]), 200


@services_bp.route('/mine', methods=['GET'])
@jwt_required()
def get_my_services():
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Tylko specjalista'}), 403

    user_id = int(get_jwt_identity())
    profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify([]), 200

    services = Service.query.filter_by(specialist_id=profile.id).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'price': s.price,
        'duration': s.duration
    } for s in services]), 200


@services_bp.route('/', methods=['POST'])
@jwt_required()
def add_service():
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Tylko specjalista moze dodawac uslugi'}), 403

    user_id = int(get_jwt_identity())
    profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'error': 'Nie masz profilu specjalisty'}), 404

    data = request.get_json()
    if not data or not data.get('name') or data.get('price') is None:
        return jsonify({'error': 'Podaj name i price'}), 400

    if float(data['price']) < 0:
        return jsonify({'error': 'Cena nie moze byc ujemna'}), 400

    service = Service(
        specialist_id=profile.id,
        name=data['name'],
        description=data.get('description', ''),
        price=float(data['price']),
        duration=int(data.get('duration', 60))
    )
    db.session.add(service)
    db.session.commit()

    return jsonify({'message': 'Usluga dodana', 'id': service.id}), 201


@services_bp.route('/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Brak uprawnien'}), 403

    user_id = int(get_jwt_identity())
    profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
    service = Service.query.get_or_404(service_id)

    if not profile or service.specialist_id != profile.id:
        return jsonify({'error': 'Brak uprawnien do tej uslugi'}), 403

    data = request.get_json()
    if 'name'        in data: service.name        = data['name']
    if 'description' in data: service.description = data['description']
    if 'price'       in data: service.price       = float(data['price'])
    if 'duration'    in data: service.duration    = int(data['duration'])

    db.session.commit()
    return jsonify({'message': 'Usluga zaktualizowana'}), 200


@services_bp.route('/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Brak uprawnien'}), 403

    user_id = int(get_jwt_identity())
    profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
    service = Service.query.get_or_404(service_id)

    if not profile or service.specialist_id != profile.id:
        return jsonify({'error': 'Brak uprawnien do tej uslugi'}), 403

    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Usluga usunieta'}), 200
