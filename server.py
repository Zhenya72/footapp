from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///footapp.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)

class Tournaments(db.Model):
    tournament_id = db.Column(db.Integer, primary_key=True)
    tournament_name = db.Column(db.String(100), nullable=False)
    implementation_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class UserTournaments(db.Model):
    participation_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.tournament_id'), nullable=False)

   
# Створення таблиць бази даних
# with app.app_context():
#     db.create_all()
    
# Очищення бази даних
# with app.app_context():
#     db.session.query(Users).delete()  # Видалення всіх записів з таблиці користувачів 
#     db.session.commit()  # Збереження змін

@app.route('/signupform', methods=['POST'])
def signupform():
    # time.sleep(2)  # Затримка на 2 секунди
    data = request.get_json() 
    existing_user = Users.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'Користувач з такою поштою вже існує'})
    else:
        password = data['password']
        hashed_password = generate_password_hash(password)
        new_user = Users(first_name=data['firstName'], last_name=data['lastName'], email=data['email'], password=hashed_password)
        db.session.add(new_user)  
        db.session.commit()  
        return jsonify({'message': 'Користувач успішно доданий до бази даних'})

@app.route('/loginform', methods=['POST'])
def loginform():
    # time.sleep(2)  # Затримка на 2 секунди
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = Users.query.filter_by(email=email).first()  # Пошук користувача за email у базі даних
    if user is None:
        return jsonify({'error': 'Користувача з таким email не знайдено'})
    elif not check_password_hash(user.password, password):  # Перевірка пароля захешованого користувача
        return jsonify({'error': 'Неправильний пароль'})
    else:
        return jsonify({'firstName': user.first_name, 'lastName': user.last_name, 'email': user.email})


@app.route('/user-tournaments', methods=['POST'])
def user_tournaments():
    data = request.get_json()
    user_email = data['email']
    user = Users.query.filter_by(email=user_email).first()  # Знаходимо користувача за email у базі даних
    if user is None:
        return jsonify({'error': 'Користувача з таким email не знайдено'})
    else:
        user_tournaments = UserTournaments.query.filter_by(user_id=user.user_id).join(Tournaments).add_columns(Tournaments.tournament_name, Tournaments.implementation_date).all()
        tournaments_data = [{'tournamentName': row.tournament_name, 'implementationDate': row.implementation_date.strftime("%Y-%m-%d %H:%M:%S")} for row in user_tournaments]
        return jsonify({'userTournaments': tournaments_data})

@app.route('/add-tournament', methods=['POST'])
def add_tournament():
    data = request.get_json()
    user_email = data['email']
    tournament_name = data['tournament_name']
    user = Users.query.filter_by(email=user_email).first()  # Знаходимо користувача за email у базі даних
    if user is None:
        return jsonify({'error': 'Користувача з таким email не знайдено'})
    else:
        new_tournament = Tournaments(tournament_name=tournament_name)
        db.session.add(new_tournament)
        db.session.commit()
        user_tournament_relation = UserTournaments(user_id=user.user_id, tournament_id=new_tournament.tournament_id)
        db.session.add(user_tournament_relation)
        db.session.commit()
        return jsonify({'message': 'Новий турнір успішно доданий для користувача'})

@app.route('/tournamentsDelete/<int:tournament_id>', methods=['DELETE'])
def delete_tournament(tournament_id):
    tournament_to_delete = Tournaments.query.get(tournament_id)
    if tournament_to_delete:
        db.session.delete(tournament_to_delete)
        db.session.commit()
        return jsonify({'message': 'Tournament successfully deleted'})
    else:
        return jsonify({'error': 'Tournament not found'})
    
if __name__ == '__main__':
    app.run(debug=True)
