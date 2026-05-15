from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    jwt.init_app(app)
    cors_origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3000",
    ]
    if os.getenv('FRONTEND_URL'):
        cors_origins.append(os.getenv('FRONTEND_URL'))
    CORS(app, resources={r"/api/*": {"origins": cors_origins}, r"/api/v1/*": {"origins": cors_origins}}, supports_credentials=True)

    from .auth import auth_bp
    from .specialists import specialists_bp
    from .bookings import bookings_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(specialists_bp, url_prefix='/api/v1/specialists')
    app.register_blueprint(bookings_bp, url_prefix='/api/v1/bookings')

    with app.app_context():
        db.create_all()

    return app