from flask import Blueprint, request, json, jsonify
from models.user import User
from models.subscription import Subscription
from werkzeug.security import check_password_hash
from datetime import date
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import calendar
import datetime
from datetime import date, timedelta

features_api_blueprint = Blueprint('features_api',
                             __name__,
                             template_folder='templates')

def convert_date(react_date):
    year = int(react_date[0:4])
    month = int(react_date[5:7])
    day = int(react_date[8:10])
    return date(year,month,day)

def add_days(sourcedate, days):
    delta = timedelta(days)
    return sourcedate + delta

def add_weeks(sourcedate, weeks):
    delta = timedelta(7*weeks)
    return sourcedate + delta

def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year,month)[1])
    return datetime.date(year, month, day)

def add_years(sourcedate, years):
    try:
        return sourcedate.replace(year = sourcedate.year + years)
    except ValueError:
        return sourcedate + (date(sourcedate.year + years, 3 , 1) - date(sourcedate.year, 3,1))

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


@features_api_blueprint.route('/subscriptions', methods = ['GET'])
@jwt_required
def subscription():
    user_id = get_jwt_identity()
    current_user = User.get_by_id(user_id)
    subs_obj = Subscription.select().where(Subscription.user_id == current_user.id).order_by(Subscription.id.desc())
    subs_arr = []
    if subs_obj:
        for sub in subs_obj: 
            str_amount = ""
            if sub.subs_type == "yearly" and sub.amount is not None:
                str_amount = "RM" + str(sub.amount) + "/y"
            elif sub.subs_type == "monthly" and sub.amount is not None:
                str_amount = "RM" + str(sub.amount) + "/m"
            elif sub.subs_type == "weekly" and sub.amount is not None:
                str_amount = "RM" + str(sub.amount) + "/w"
            elif sub.subs_type == "daily" and sub.amount is not None:
                str_amount = "RM" + str(sub.amount) + "/d"

            subs_list = {
                'id': sub.id,
                'name': sub.name,
                'amount': sub.amount,
                'str_amount': str_amount,
                'subs_type': sub.subs_type,
                'last_payment': sub.payment_date.strftime('%A %d %b %Y'),
                'next_payment': sub.next_payment.strftime('%A %d %b %Y'),
                'description': sub.description,
                'paid': sub.paid
            }

            subs_arr.append(subs_list)
        
        responseObj = {
            'status': 'success',
            'subscriptions': subs_arr
        }

        return jsonify(responseObj), 200
    
    else:
        responseObj = {
            'status': 'success but array is empty',
            'subscriptions': subs_arr
        }

        return jsonify(responseObj), 200

@features_api_blueprint.route('/subs_delete/<id>', methods=['POST'])
@jwt_required 
def subs_delete(id):
    user_id = get_jwt_identity()
    sub = Subscription.get_by_id(id)
    if sub.delete_instance():
        subs_obj = Subscription.select().where(Subscription.user_id == user_id)
        subs_arr = []
        if subs_obj:
            for sub in subs_obj:
                str_amount = ""
                if sub.subs_type == "yearly" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/y"
                elif sub.subs_type == "monthly" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/m"
                elif sub.subs_type == "weekly" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/w"
                elif sub.subs_type == "daily" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/d"

                subs_list = {
                    'id': sub.id,
                    'name': sub.name,
                    'amount': sub.amount,
                    'str_amount': str_amount,
                    'subs_type': sub.subs_type,
                    'last_payment': sub.payment_date.strftime('%A %d %b %Y'),
                    'next_payment': sub.next_payment.strftime('%A %d %b %Y'),
                    'description': sub.description,
                    'paid': sub.paid
                }

                subs_arr.append(subs_list)

        responseObj = {
            'status': 'success',
            'message': 'Successfully deleted subscription!',
            'subscriptions': subs_arr
        }

        return jsonify(responseObj), 200
    
    else:
        responseObj = {
            'status': 'failed',
            'message': 'Failed to delete your subscription'
        }

        return jsonify(responseObj), 400

@features_api_blueprint.route('/status/<id>', methods = ['POST'])
@jwt_required
def status(id): 
    user_id = get_jwt_identity()
    sub = Subscription.get_by_id(id)
    query = Subscription.update(paid = not sub.paid).where(Subscription.id == id)

    if query.execute():
        subs_obj = Subscription.select().where(Subscription.user_id == user_id).order_by(Subscription.id.desc())
        subs_arr = []
        if subs_obj:
            for sub in subs_obj:
                str_amount = ""
                if sub.subs_type == "yearly" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/y"
                elif sub.subs_type == "monthly" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/m"
                elif sub.subs_type == "weekly" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/w"
                elif sub.subs_type == "daily" and sub.amount is not None:
                    str_amount = "RM" + str(sub.amount) + "/d"

                subs_list = {
                    'id': sub.id,
                    'name': sub.name,
                    'amount': sub.amount,
                    'str_amount': str_amount,
                    'subs_type': sub.subs_type,
                    'last_payment': sub.payment_date.strftime('%A %d %b %Y'),
                    'next_payment': sub.next_payment.strftime('%A %d %b %Y'),
                    'description': sub.description,
                    'paid': sub.paid
                }

                subs_arr.append(subs_list)

        responseObj = {
            'status': 'success',
            'subscriptions': subs_arr
        }

        return jsonify(responseObj), 200
    
    else:
        responseObj = {
            'status': 'failed',
            'message': 'Failed to change your paid status'
        }

        return jsonify(responseObj), 400

@features_api_blueprint.route('/sub_data/<id>', methods=['POST'])
@jwt_required
def get_sub_data(id):
    user_id = get_jwt_identity()
    sub = Subscription.get_by_id(id)
    subs_list = {
        'id': sub.id,
        'name': sub.name,
        'amount': sub.amount,
        'description': sub.description,
        'frequency': sub.frequency,
        'subs_type': sub.subs_type,
        'payment_date': sub.payment_date
        
    }
    
    responseObj = {
        'status': 'success',
        'subscriptions': subs_list
    }

    return jsonify(responseObj), 200

@features_api_blueprint.route('/edit/<id>', methods=['POST'])
@jwt_required
def edit(id): 
    user_id = get_jwt_identity()
    sub = Subscription.get_by_id(id)
    name = request.json.get('name')
    amount = request.json.get('amount')
    description = request.json.get('description')
    frequency = request.json.get('frequency')
    frequency = int(frequency)
    subs_type = request.json.get('subs_type')
    payment_date = request.json.get('payment_date')
    payment_date = convert_date(payment_date)

    if subs_type == "daily": 
        next_payment = add_days(payment_date, frequency)

    elif subs_type == "weekly":
        next_payment = add_weeks(payment_date, frequency)

    elif subs_type == "monthly":
        next_payment = add_months(payment_date, frequency)

    elif subs_type == "yearly":
        next_payment = add_years(payment_date, frequency)

    query = Subscription.update(name=name, amount=amount, description=description, frequency=frequency, subs_type=subs_type, payment_date=payment_date, next_payment=next_payment).where(Subscription.id == sub.id)
    
    if query.execute():
        responseObj = {
            'status': 'success',
            'message': 'Successfully edited subscription'
        }

        return jsonify(responseObj), 200
    
    else:
        responseObj = {
            'status': 'failed',
            'message': 'Failed to edit your subscription'
        }

        return jsonify(responseObj), 400


