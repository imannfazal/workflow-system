from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   # allows React to talk to Flask

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workflow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running!"})

if __name__ == "__main__":
    app.run(debug=True)
