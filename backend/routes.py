from flask import Blueprint, request, jsonify
from database import db
from models import User, Workflow
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint("api", __name__)

#AUTH routes
@api.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = generate_password_hash(password)
    user = User(name=name, email=email, password=hashed_pw)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@api.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.to_dict()}), 200

# Health check
@api.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running!"})

# ---------------- USERS ---------------- #

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

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(name=name, email=email)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

@api.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)

    db.session.commit()
    return jsonify(user.to_dict()), 200

@api.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200


# ---------------- WORKFLOWS ---------------- #

@api.route("/api/users/<int:user_id>/workflows", methods=["GET"])
@jwt_required()
def get_user_workflows(user_id):
    current_user = get_jwt_identity()

    if current_user != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    workflows = Workflow.query.filter_by(user_id=user_id).all()
    return jsonify([w.to_dict() for w in workflows])

@api.route("/api/users/<int:user_id>/workflows", methods=["POST"])
@jwt_required()
def add_workflow(user_id):
    current_user = get_jwt_identity()

    # 🔒 Only allow if user is creating their own workflow
    if current_user != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    title = data.get("title")

    if not title:
        return jsonify({"error": "Title required"}), 400

    workflow = Workflow(title=title, status="Pending", user_id=user_id)
    db.session.add(workflow)
    db.session.commit()

    return jsonify(workflow.to_dict()), 201

@api.route("/api/workflows/<int:workflow_id>", methods=["PUT"])
@jwt_required()
def update_workflow(workflow_id):
    workflow = Workflow.query.get(workflow_id)
    if not workflow:
        return jsonify({"error": "Workflow not found"}), 404

    current_user = get_jwt_identity()
    if workflow.user_id != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    workflow.title = data.get("title", workflow.title)
    workflow.status = data.get("status", workflow.status)

    db.session.commit()
    return jsonify(workflow.to_dict()), 200


@api.route("/api/workflows/<int:workflow_id>", methods=["DELETE"])
@jwt_required()
def delete_workflow(workflow_id):
    workflow = Workflow.query.get(workflow_id)
    if not workflow:
        return jsonify({"error": "Workflow not found"}), 404

    current_user = get_jwt_identity()
    if workflow.user_id != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(workflow)
    db.session.commit()
    return jsonify({"message": "Workflow deleted"}), 200

