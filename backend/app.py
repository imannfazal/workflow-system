from flask import Flask
from flask_cors import CORS
from database import db
from routes import api
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///workflow.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Config
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

db.init_app(app)
app.register_blueprint(api)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
