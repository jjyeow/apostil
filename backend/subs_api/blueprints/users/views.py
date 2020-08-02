from flask import Blueprint, request, json, jsonify
from models.user import User
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

users_api_blueprint = Blueprint('users_api',
                             __name__,
                             template_folder='templates')

@users_api_blueprint.route('/', methods=['GET'])
def index():
    return "USERS API"

@users_api_blueprint.route('/signup', methods = ['POST'])
def add(): 
    username = request.json.get('username')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    email = request.json.get('email')
    password = request.json.get('password')
    hp_number = request.json.get('hp_number')

    new_user = User(username=username, email=email, first_name=first_name, last_name=last_name, password=password, hp_number=hp_number)

    if new_user.save():
        responseObj = {
            'status': 'success',
            'message': 'New user successfully added',
            'user': {   'id': int(new_user.id), 
                        'username': new_user.username, 
                        'email': new_user.email, 
                        'first_name': new_user.first_name,
                        'last_name': new_user.last_name,
                        'hp_number': new_user.hp_number}
        }

        return jsonify(responseObj), 200

    else:
        responseObj = {
            'status': 'failed',
            'message': new_user.errors
        }

        return jsonify(responseObj), 400

@users_api_blueprint.route('/login', methods = ['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    login_user = User.get_or_none(username=username)

    if login_user:
        if check_password_hash(login_user.password, password):
            access_token = create_access_token(identity = login_user.id, expires_delta = False)
            responseObj = {
                'status': 'success',
                'message': 'Login successfully',
                'token': access_token,
                'user': {   "id": int(login_user.id),
                            "username": login_user.username,
                            "email": login_user.email,
                            "first_name": login_user.first_name,
                            "last_name": login_user.last_name,
                            "hp_number": login_user.hp_number,
                            }
            } 
            return jsonify(responseObj), 200

        else: 
            responseObj = {
                'status': 'failed',
                'message': 'Incorrect Password!'
            } 
            return jsonify(responseObj), 400
    
    else: 
        responseObj = {
            'status': 'failed',
            'message': 'Incorrect username!'
        }  
        return jsonify(responseObj), 400
