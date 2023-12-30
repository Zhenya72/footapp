from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import time
import os
from datetime import datetime, time


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///footapp.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOADED_PHOTOS_DEST'] = 'uploads'
app.config['UPLOADED_DOCUMENTS_DEST'] = 'documents' 
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

class Teams(db.Model):
    team_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    year_of_foundation = db.Column(db.Integer, nullable=False)
    coach = db.Column(db.String(100), nullable=False)
    games = db.Column(db.Integer, default=0, nullable=False)
    victories = db.Column(db.Integer, default=0, nullable=False)
    nobodys = db.Column(db.Integer, default=0, nullable=False)
    defeats = db.Column(db.Integer, default=0, nullable=False)
    goals_scored = db.Column(db.Integer, default=0, nullable=False)
    missed_balls = db.Column(db.Integer, default=0, nullable=False)
    goal_difference = db.Column(db.Integer, default=0, nullable=False)
    points = db.Column(db.Integer, default=0, nullable=False)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.tournament_id'), nullable=False)

class Players(db.Model):
    player_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    height = db.Column(db.Numeric(precision=5, scale=2), default=0, nullable=False)  # Зміна типу на числодроби
    weight = db.Column(db.Numeric(precision=5, scale=2), default=0, nullable=False)  # Зміна типу на числодроби
    game_number = db.Column(db.Integer, default=0, nullable=False)

class Matches(db.Model):
    match_id = db.Column(db.Integer, primary_key=True)
    match_date = db.Column(db.Date, nullable=False)
    match_time = db.Column(db.Time, nullable=False)
    stadium = db.Column(db.String(100), nullable=False)
    home_team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'), nullable=False)
    away_team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'), nullable=False)
    home_team_goals = db.Column(db.Integer, default=0, nullable=False)
    away_team_goals = db.Column(db.Integer, default=0, nullable=False)

class Goals(db.Model):
    goal_id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('matches.match_id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.player_id'), nullable=False)
    time_of_goal = db.Column(db.Time, nullable=False)

class Assistants(db.Model):
    assistant_id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('matches.match_id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.player_id'), nullable=False)
    time_of_assist = db.Column(db.Time, nullable=False)
  

   
# Створення таблиць бази даних
# with app.app_context():
#     db.create_all()
    
# Очищення бази даних
# with app.app_context():
#     db.session.query(Users).delete()  # Видалення всіх записів з таблиці користувачів
#     db.session.query(Tournaments).delete()  # Видалення всіх записів з таблиці турнірів 
#     db.session.query(UserTournaments).delete()  # Видалення всіх записів з таблиці користувачів-турнірів 
#     db.session.query(Teams).delete()  # Видалення всіх записів з таблиці команд 
#     db.session.query(Players).delete()  # Видалення всіх записів з таблиці гравців 
#     db.session.commit()  # Збереження змін


@app.route('/signupform', methods=['POST'])
def signupform():
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
        user_tournaments = UserTournaments.query.filter_by(user_id=user.user_id).join(Tournaments).add_columns(Tournaments.tournament_id, Tournaments.tournament_name, Tournaments.implementation_date).all()
        tournaments_data = [{'id':row.tournament_id, 'tournamentName': row.tournament_name, 'implementationDate': row.implementation_date.strftime("%Y-%m-%d %H:%M:%S")} for row in user_tournaments]
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
        user_tournaments_to_delete = UserTournaments.query.filter_by(tournament_id=tournament_id).all()
        for user_tournament in user_tournaments_to_delete:
            db.session.delete(user_tournament)
        db.session.commit()
        return jsonify({'message': 'Tournament successfully deleted'})
    else:
        return jsonify({'error': 'Tournament not found'})


@app.route('/tournamentsEdit/<int:tournament_id>', methods=['PUT'])
def edit_tournament(tournament_id):
    data = request.get_json()
    tournament_to_edit = Tournaments.query.get(tournament_id)  # Знаходимо турнір за його ID
    if tournament_to_edit:
        tournament_to_edit.tournament_name = data['tournamentName']  # Змінюємо назву турніру
        db.session.commit()  # Зберігаємо зміни в базі даних
        return jsonify({'message': 'Tournament name successfully updated'})
    else:
        return jsonify({'error': 'Tournament not found'})


@app.route('/add-teams', methods=['POST'])
def add_team_to_tournament():
    data = request.get_json()
    tournamentId = data['tournamentId']
    team_name = data['name']
    country = data['country']
    yearOfFoundation = data['yearOfFoundation']
    coach = data['coach']
    games = data['games']
    victories = data['victories']
    nobodys = data['nobodys']
    defeats = data['defeats']
    goalsScored = data['goalsScored']
    missedBalls = data['missedBalls']
    goalDifference = data['goalDifference']
    points = data['points']
    tournament = Tournaments.query.filter_by(tournament_id=tournamentId).first()
    if tournament is None:
        return jsonify({'error': 'Турніру з даним ID не існує'})
    new_team = Teams(name=team_name, country=country, year_of_foundation=yearOfFoundation, coach=coach, games=games, victories=victories, nobodys=nobodys, defeats=defeats, goals_scored=goalsScored, missed_balls=missedBalls, goal_difference=goalDifference, points=points, tournament_id=tournamentId)
    db.session.add(new_team)
    db.session.commit()
    return jsonify({'message': 'Команда успішно додана до турніру'})


@app.route('/teams', methods=['POST'])
def fetch_teams():
    data = request.get_json()
    tournamentId = data['tournamentId']
    teams = Teams.query.filter_by(tournament_id=tournamentId).all()
    if teams:
        serialized_teams = [
            {
                'team_id': team.team_id,
                'name': team.name,
                'country': team.country,
                'yearOfFoundation': team.year_of_foundation,
                'coach': team.coach
            }
            for team in teams
        ]
        return jsonify({'teams': serialized_teams})
    else:
        return jsonify({'error': 'Команди для цього турніру не знайдено'})

@app.route('/teamsDelete/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team_to_delete = Teams.query.get(team_id)
    if team_to_delete:
        db.session.delete(team_to_delete)
        db.session.commit()
        return jsonify({'message': 'Команда успішно видалена'})
    else:
        return jsonify({'error': 'Команду не знайдено'})


@app.route('/edit-teams/<int:team_id>', methods=['PATCH'])
def edit_teams(team_id):
    data = request.get_json()
    team_to_edit = Teams.query.get(team_id)  # Знаходимо команду за його ID
    if team_to_edit:
        team_to_edit.name = data['name']  # Змінюємо назву команди
        team_to_edit.country = data['country'] 
        team_to_edit.year_of_foundation = data['yearOfFoundation']  
        team_to_edit.coach = data['coach']  
        db.session.commit()  # Зберігаємо зміни в базі даних
        return jsonify({'message': 'Команду оновлено'})
    else:
        return jsonify({'error': 'Team not found'})


@app.route('/add-player', methods=['POST'])
def add_player():
    data = request.get_json()
    new_player = Players(
        first_name=data['firstName'],
        last_name=data['lastName'],
        team_id=data['teamId'],
        position=data['position'],
        birthday=datetime.strptime(data['birthday'], '%Y-%m-%d').date(),
        height=data['height'],
        weight=data['weight'],
        game_number=data['gameNumber']
    )
    team = Teams.query.filter_by(team_id=data['teamId']).first()
    if team is None:
        return jsonify({'error': 'Команди з даним ID не існує'})
    db.session.add(new_player)
    db.session.commit()
    return jsonify({'message': 'Гравець успішно доданий в базу даних'})


@app.route('/players', methods=['POST'])
def fetch_players():
    data = request.get_json()
    tournamentId = data['tournamentId']
    # Вибрати всі команди для вказаного турніру
    teams = Teams.query.filter_by(tournament_id=tournamentId).all()
    # Зібрати ідентифікатори команд у список
    team_ids = [team.team_id for team in teams]
    # Вибрати всіх гравців, які є у вибраних командах
    players = Players.query.filter(Players.team_id.in_(team_ids)).all()
    if players:
        serialized_players = [
            {
                'player_id': player.player_id,
                'first_name': player.first_name,
                'last_name': player.last_name,
                'team_id': player.team_id,
                'position': player.position,
                'birthday': player.birthday.strftime('%Y-%m-%d'),  # При потребі форматування дати
                'height': player.height,  # Перетворення на float
                'weight': player.weight,  # Перетворення на float
                'game_number': player.game_number,
            }
            for player in players
        ]
        return jsonify({'players': serialized_players})
    else:
        return jsonify({'error': 'Гравців для цього турніру не знайдено'})

@app.route('/playersDelete/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    player_to_delete = Players.query.get(player_id)
    if player_to_delete:
        db.session.delete(player_to_delete)
        db.session.commit()
        return jsonify({'message': 'Команда успішно видалена'})
    else:
        return jsonify({'error': 'Команду не знайдено'})
    

@app.route('/edit-players/<int:player_id>', methods=['PATCH'])
def edit_players(player_id):
    data = request.get_json()
    player_to_edit = Players.query.get(player_id)  # Знаходимо гравця за його ID
    if player_to_edit:
        player_to_edit.first_name = data['firstName']  # Змінюємо гравця
        player_to_edit.last_name = data['lastName'] 
        player_to_edit.team_id = data['teamId']  
        player_to_edit.position = data['position']  
        player_to_edit.birthday = datetime.strptime(data['birthday'], '%Y-%m-%d').date()  
        player_to_edit.height = data['height']  
        player_to_edit.weight = data['weight']  
        player_to_edit.game_number = data['gameNumber']  
        db.session.commit()  # Зберігаємо зміни в базі даних
        return jsonify({'message': 'Гравця оновлено'})
    else:
        return jsonify({'error': 'Гравця не знайдено'})
    

@app.route('/add-match', methods=['POST'])
def add_match():
    data = request.get_json()
    new_match = Matches(
        match_date=datetime.strptime(data['matchDate'], '%Y-%m-%d').date(),
        match_time=datetime.strptime(data['matchTime'], '%H:%M').time(),
        stadium=data['stadium'],
        home_team_id=data['homeTeamId'],
        away_team_id=data['awayTeamId'],
        home_team_goals=data['homeTeamGoals'],
        away_team_goals=data['awayTeamGoals']
    )
    db.session.add(new_match)
    db.session.commit()
    return jsonify({'message': 'Матч успішно доданий в базу даних'})



if __name__ == '__main__':
    app.run(debug=True)
