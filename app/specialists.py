import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from . import db
from .models import SpecialistProfile

specialists_bp = Blueprint('specialists', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
UPLOAD_FOLDER = 'static/uploads'


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
        'bio': s.bio,
        'photo_url': s.photo_url or ''
    } for s in specialists]), 200


@specialists_bp.route('/<int:specialist_id>', methods=['GET'])
def get_specialist(specialist_id):
    s = SpecialistProfile.query.get_or_404(specialist_id)
    return jsonify({
        'id': s.id,
        'name': s.name,
        'city': s.city,
        'specialization': s.specialization,
        'bio': s.bio,
        'photo_url': s.photo_url or ''
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


@specialists_bp.route('/me/photo', methods=['POST'])
@jwt_required()
def upload_photo():
    claims = get_jwt()
    if claims.get('role') != 'specialist':
        return jsonify({'error': 'Tylko specjalista moze dodac zdjecie'}), 403

    user_id = int(get_jwt_identity())
    profile = SpecialistProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'error': 'Nie masz profilu specjalisty'}), 404

    if 'photo' not in request.files:
        return jsonify({'error': 'Brak pliku w zapytaniu'}), 400

    file = request.files['photo']
    if file.filename == '':
        return jsonify({'error': 'Nie wybrano pliku'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Dozwolone formaty: jpg, png, gif, webp'}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    filename = f"specialist_{profile.id}_{secure_filename(file.filename)}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    photo_url = f"http://127.0.0.1:8000/static/uploads/{filename}"
    profile.photo_url = photo_url
    db.session.commit()

    return jsonify({'message': 'Zdjecie zaktualizowane', 'photo_url': photo_url}), 200
