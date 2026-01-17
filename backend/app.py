from flask import Flask
from flask_cors import CORS
from database import db
from routes import api
from flask_jwt_extended import JWTManager
import models  # <-- import your models here so tables exist

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///workflow.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Config
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

db.init_app(app)
app.register_blueprint(api)

# 🔹 Ensure tables are created
with app.app_context():
    db.create_all()  # now knows about User and Workflow
    print("✅ Tables created successfully")

if __name__ == "__main__":
    app.run(debug=True)
