from flask import Flask, request, jsonify, render_template
import json
import os
from datetime import datetime

app = Flask(__name__)

# File to store user data
DATA_FILE = 'users.json'

# Initialize data file if it doesn't exist
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def load_users():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(DATA_FILE, 'w') as f:
        json.dump(users, f, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/users', methods=['GET'])
def get_users():
    users = load_users()
    return jsonify(users)

@app.route('/users', methods=['POST'])
def add_user():
    users = load_users()
    
    new_user = {
        'id': len(users) + 1,
        'name': request.json['name'],
        'date_of_birth': request.json['date_of_birth'],
        'address': request.json['address'],
        'phone_number': request.json['phone_number'],
        'created_at': datetime.now().isoformat()
    }
    
    users.append(new_user)
    save_users(users)
    
    return jsonify(new_user), 201

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    users = load_users()
    users = [user for user in users if user['id'] != user_id]
    save_users(users)
    return jsonify({'message': 'User deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)