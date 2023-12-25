from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import time

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
        return jsonify({'message': 'Успішно ввійдено'})

    
if __name__ == '__main__':
    app.run(debug=True)
