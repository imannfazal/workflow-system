from flask import Blueprint, request, jsonify
from database import db
from models import User

api = Blueprint("api", __name__)

@api.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running!"})

@api.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@api.route("/api/users", methods=["POST"])
def add_user():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "User already exists"}), 400

    user = User(name=name, email=email)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201
