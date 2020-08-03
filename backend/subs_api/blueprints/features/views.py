from flask import Blueprint, request, json, jsonify
from models.user import User
from models.subscription import Subscription
from werkzeug.security import check_password_hash
from datetime import date
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

features_api_blueprint = Blueprint('features_api',
                             __name__,
                             template_folder='templates')

@features_api_blueprint.route('/', methods = ['POST'])
@jwt_required
def add():
    user_id = get_jwt_identity()
    name = request.json.get('name')
    amount = request.json.get('amount')
    payment_date = request.json.get('payment_date')
    payment_date = convert_date(payment_date)
    subs_type = request.json.get('subs_type')
    frequency = request.json.get('frequency')
    description = request.json.get('description')
    new_subs = Subscription(user_id=user_id, name=name, amount=amount, payment_date=payment_date, subs_type=subs_type, frequency = int(frequency), description=description)

    if new_subs.save():
        responseObj = {
            'status': 'success',
            'message': 'New subscription added!',
            'subscription': {   'name': name,
                                'amount': amount,
                                'next_payment': new_subs.next_payment,
                                'description': description}
        }

        return jsonify(responseObj), 200

    else: 
        responseObj = {
            'status': 'failed',
            'message': 'Subscription has failed to be added'
        }

        return jsonify(responseObj), 200

def convert_date(react_date):
    year = int(react_date[0:4])
    month = int(react_date[5:7])
    day = int(react_date[8:10])

    return date(year,month,day)

