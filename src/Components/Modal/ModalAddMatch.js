import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import { PlusCircle } from 'react-bootstrap-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalAddMatch = ({ teams, players }) => {
  const [loading, setLoading] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const [matchDate, setMatchDate] = useState('');  
  const [matchTime, setMatchTime] = useState('');  
  const [stadium, setStadium] = useState('');  
  const [homeTeamId, setHomeTeamId] = useState(0);  
  const [awayTeamId, setAwayTeamId] = useState(0);  
  const [homeTeamGoals, setHomeTeamGoals] = useState('');  
  const [awayTeamGoals, setAwayTeamGoals] = useState('');  

  const [awayTeamsForSelect, setAwayTeamsForSelect] = useState([]);  


  const [timeOfGoal, setTimeOfGoal] = useState('');  
  const [timeOfAssist, setTimeOfAssist] = useState('');


  const [playersId, setPlayersId] = useState({});

  useEffect(() => {
    const newPlayers = {};
    for (let i = 1; i <= homeTeamGoals; i++) {
      newPlayers[i] = [null, (value) => handleSetPlayerId(i, value)]; 
    }
    setPlayersId(newPlayers);
  }, [homeTeamGoals]);

  // Функція, яка викликає setPlayerId для конкретного гравця
  const handleSetPlayerId = (playerNumber, playerIdValue) => {
    setPlayersId(prevState => ({
      ...prevState,
      [playerNumber]: [playerIdValue, prevState[playerNumber][1]]
    }));
  };

  
  const handleModalAddClose = () => {
    setModalAddShow(false);
    setMatchDate('');
    setMatchTime('');
    setStadium('')
    setHomeTeamId(0);
    setAwayTeamId(0);
    setHomeTeamGoals('');
    setAwayTeamGoals('');
  } 
  const handleModalAddShow = () => {
    setModalAddShow(true);
    setMatchDate('');
    setMatchTime('');
    setStadium('')
    setHomeTeamId(0);
    setAwayTeamId(0);
    setHomeTeamGoals('');
    setAwayTeamGoals('');
  } 


  const addMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(playersId)
    try {
      await axios.post(`http://127.0.0.1:5000/add-match`, { 'matchDate': new Date(matchDate).toISOString().split('T')[0], 'matchTime': matchTime, 'stadium': stadium, 'homeTeamId': parseInt(homeTeamId), 'awayTeamId': parseInt(awayTeamId), 'homeTeamGoals': parseInt(homeTeamGoals), 'awayTeamGoals': parseInt(awayTeamGoals)});
      // fetchMatch();
      handleModalAddClose();
    } catch (error) {
      console.error('Помилка додавання матчу:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log(homeTeamId);
  //   console.log();
  // }, [homeTeamId]);
    
    
    
  return (
    <div>
      {loading && <Loader/>}
          <Button onClick={handleModalAddShow} className="me-2 add_button"><PlusCircle className="add_button__icons"/></Button>
        {/* Модальне вікно для додавання матчу */}
        <div>
          <Modal show={modalAddShow} onHide={handleModalAddClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати матч</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3'>
                <Form.Control
                  type='date'
                  placeholder='Введіть дату матчу'
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Control
                  type='time'
                  placeholder='Введіть час матчу'
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                />
              </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder='Введіть стадіон матчу'
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Select
                value={homeTeamId}
                onChange={(e) => {
                  setHomeTeamId(e.target.value);
                  setAwayTeamsForSelect(teams.filter(team => team.team_id !== parseInt(e.target.value))
                    .sort((a, b) => a.name.localeCompare(b.name)));
                }}
              >
                <option>Виберіть домашню команду</option>
                {teams.sort((a, b) => a.name.localeCompare(b.name))
                  .map(team => (
                  <option key={team.team_id} value={team.team_id}>{team.name}</option>
                  ))} 
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Select
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
              >
                <option>Виберіть на виїзді команду</option>
                {awayTeamsForSelect.map(team => (
                  <option key={team.team_id} value={team.team_id}>{team.name}</option>
                  ))} 
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder='Введіть кількість забитих голів дом команди'
                  value={homeTeamGoals}
                onChange={(e) => setHomeTeamGoals(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder='Введіть кількість забитих голів виїзд команди'
                  value={awayTeamGoals}
                  onChange={(e) => setAwayTeamGoals(e.target.value)}
              />
            </Form.Group>
            {homeTeamGoals && homeTeamGoals > 0 && homeTeamId &&
              Object.keys(playersId).map((playerNumber) => (
                <Form.Group key={playerNumber} className='mb-3'>
                  <Form.Select
                    value={playersId[playerNumber][0]}
                    onChange={(e) => handleSetPlayerId(playerNumber, e.target.value)}
                  >
                    <option>Виберіть гравця</option>
                    {players.filter(player => player.team_id === parseInt(homeTeamId))
                      .sort((a, b) => a.first_name.localeCompare(b.first_name))
                      .map(player => (
                      <option key={player.player_id} value={player.player_id}>{player.first_name} {player.last_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ))}

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalAddClose}>
                Закрити
              </Button>
              <Button variant="primary" onClick={addMatch}>
                Додати
              </Button>
            </Modal.Footer>
        </Modal>
      </div>
          </div>
  );
};

export default ModalAddMatch;




