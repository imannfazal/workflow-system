from flask import Blueprint, request, jsonify
from database import db
from models import User, Workflow

api = Blueprint("api", __name__)

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
def get_user_workflows(user_id):
    workflows = Workflow.query.filter_by(user_id=user_id).all()
    return jsonify([w.to_dict() for w in workflows]), 200

@api.route("/api/users/<int:user_id>/workflows", methods=["POST"])
def add_workflow(user_id):
    data = request.get_json()
    title = data.get("title")

    if not title:
        return jsonify({"error": "Title required"}), 400

    workflow = Workflow(title=title, status="Pending", user_id=user_id)
    db.session.add(workflow)
    db.session.commit()

    return jsonify(workflow.to_dict()), 201

@api.route("/api/workflows/<int:workflow_id>", methods=["PUT"])
def update_workflow(workflow_id):
    workflow = Workflow.query.get(workflow_id)
    if not workflow:
        return jsonify({"error": "Workflow not found"}), 404

    data = request.get_json()
    workflow.title = data.get("title", workflow.title)
    workflow.status = data.get("status", workflow.status)

    db.session.commit()
    return jsonify(workflow.to_dict()), 200

@api.route("/api/workflows/<int:workflow_id>", methods=["DELETE"])
def delete_workflow(workflow_id):
    workflow = Workflow.query.get(workflow_id)
    if not workflow:
        return jsonify({"error": "Workflow not found"}), 404

    db.session.delete(workflow)
    db.session.commit()
    return jsonify({"message": "Workflow deleted"}), 200
