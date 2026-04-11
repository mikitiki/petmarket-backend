from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from . import db
from .models import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({'error': 'Podaj email, password i role'}), 400

    if data['role'] not in ['owner', 'specialist']:
        return jsonify({'error': 'Rola musi byc owner lub specialist'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Ten email jest juz zajety'}), 409

    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    user = User(
        email=data['email'],
        password_hash=hashed.decode('utf-8'),
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Konto utworzone', 'id': user.id}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Podaj email i password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'Zly email lub haslo'}), 401

    token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})

    return jsonify({
        'token': token,
        'role': user.role,
        'user_id': user.id
    }), 200