import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { PlusCircle } from 'react-bootstrap-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalAddMatch = ({ teams, players, fetchMatches }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalAddShow, setModalAddShow] = useState(false);
  const [matchDate, setMatchDate] = useState('');  
  const [matchTime, setMatchTime] = useState('');  
  const [stadium, setStadium] = useState('');  
  const [homeTeamId, setHomeTeamId] = useState(0);  
  const [awayTeamId, setAwayTeamId] = useState(0);  
  const [homeTeamGoals, setHomeTeamGoals] = useState('');  
  const [awayTeamGoals, setAwayTeamGoals] = useState('');  

  const [awayTeamsForSelect, setAwayTeamsForSelect] = useState([]);  

  const [dataGoalsHome, setdataGoalsHome] = useState([]);
  const renderGoalInputsHome = () => {
  if (homeTeamId && homeTeamGoals) {
  return Array.from({ length: parseInt(homeTeamGoals) }, (_, index) => (
    <Form.Group key={index} className='bottom_group_input_left'>
      <Form.Label>{`Goal ${index + 1}`}</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Minute"
        value={dataGoalsHome[index] ? dataGoalsHome[index].minute : ''}
        onChange={(e) => {
              let newdataGoalsHome = [...dataGoalsHome];
              newdataGoalsHome[index] = { playerId: newdataGoalsHome[index] ? newdataGoalsHome[index].playerId : '', minute: e.target.value, assistant: newdataGoalsHome[index] ? newdataGoalsHome[index].assistant : '' };
              setdataGoalsHome(newdataGoalsHome);
            }}
      />
      <Form.Select
        value={dataGoalsHome[index] ? dataGoalsHome[index].playerId : ''}
        onChange={(e) => {
              let newdataGoalsHome = [...dataGoalsHome];
              newdataGoalsHome[index] = { playerId: e.target.value, minute: newdataGoalsHome[index] ? newdataGoalsHome[index].minute : '', assistant: newdataGoalsHome[index] ? newdataGoalsHome[index].assistant : '' };
              setdataGoalsHome(newdataGoalsHome);
            }}
      >
        <option>Select a player</option>
        {players.filter(player => player.team_id === parseInt(homeTeamId))
        .sort((a, b) => a.first_name.localeCompare(b.first_name))
        .map(player => (
        <option key={player.player_id} value={player.player_id}>{player.first_name} {player.last_name}</option>
        ))}
      </Form.Select>
      <Form.Select
        value={dataGoalsHome[index] ? dataGoalsHome[index].assistant : ''}
        onChange={(e) => {
              let newdataGoalsHome = [...dataGoalsHome];
              newdataGoalsHome[index] = { playerId: newdataGoalsHome[index] ? newdataGoalsHome[index].playerId : '', minute: newdataGoalsHome[index] ? newdataGoalsHome[index].minute : '', assistant: e.target.value };
              setdataGoalsHome(newdataGoalsHome);
            }}
      >
        <option value="">No one gave back</option>
        {players.filter(player => player.team_id === parseInt(homeTeamId))
        .sort((a, b) => a.first_name.localeCompare(b.first_name))
        .map(player => (
        <option key={player.player_id} value={player.player_id}>{player.first_name} {player.last_name}</option>
        ))}
      </Form.Select>
    </Form.Group>
  ));
    }
    return null;
};

  const [dataGoalsAway, setdataGoalsAway] = useState([]);
  const renderGoalInputsAway = () => {
  if (awayTeamId && awayTeamGoals) {
  return Array.from({ length: parseInt(awayTeamGoals) }, (_, index) => (
    <Form.Group key={index} className='bottom_group_input_right'>
      <Form.Label>{`Goal ${index + 1}`}</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Minute"
        value={dataGoalsAway[index] ? dataGoalsAway[index].minute : ''}
        onChange={(e) => {
              let newdataGoalsAway = [...dataGoalsAway];
              newdataGoalsAway[index] = { playerId: newdataGoalsAway[index] ? newdataGoalsAway[index].playerId : '', minute: e.target.value, assistant: newdataGoalsAway[index] ? newdataGoalsAway[index].assistant : '' };
              setdataGoalsAway(newdataGoalsAway);
            }}
      />
      <Form.Select
        value={dataGoalsAway[index] ? dataGoalsAway[index].playerId : ''}
        onChange={(e) => {
              let newdataGoalsAway = [...dataGoalsAway];
              newdataGoalsAway[index] = { playerId: e.target.value, minute: newdataGoalsAway[index] ? newdataGoalsAway[index].minute : '', assistant: newdataGoalsAway[index] ? newdataGoalsAway[index].assistant : '' };
              setdataGoalsAway(newdataGoalsAway);
            }}
      >
        <option>Select a player</option>
        {players.filter(player => player.team_id === parseInt(awayTeamId))
        .sort((a, b) => a.first_name.localeCompare(b.first_name))
        .map(player => (
        <option key={player.player_id} value={player.player_id}>{player.first_name} {player.last_name}</option>
        ))}
      </Form.Select>
      <Form.Select
        value={dataGoalsAway[index] ? dataGoalsAway[index].assistant : ''}
        onChange={(e) => {
              let newdataGoalsAway = [...dataGoalsAway];
              newdataGoalsAway[index] = { playerId: newdataGoalsAway[index] ? newdataGoalsAway[index].playerId : '', minute: newdataGoalsAway[index] ? newdataGoalsAway[index].minute : '', assistant: e.target.value };
              setdataGoalsAway(newdataGoalsAway);
            }}
      >
        <option value="">No one gave back</option>
        {players.filter(player => player.team_id === parseInt(awayTeamId))
        .sort((a, b) => a.first_name.localeCompare(b.first_name))
        .map(player => (
        <option key={player.player_id} value={player.player_id}>{player.first_name} {player.last_name}</option>
        ))}
      </Form.Select>
    </Form.Group>
  ));
    }
    return null;
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
    try {
      await axios.post(`http://127.0.0.1:5000/add-match`, { 'matchDate': new Date(matchDate).toISOString().split('T')[0], 'matchTime': matchTime, 'stadium': stadium, 'homeTeamId': parseInt(homeTeamId), 'awayTeamId': parseInt(awayTeamId), 'homeTeamGoals': parseInt(homeTeamGoals), 'awayTeamGoals': parseInt(awayTeamGoals), 'dataGoalsHome': dataGoalsHome, 'dataGoalsAway': dataGoalsAway});
      fetchMatches();
      handleModalAddClose();
    } catch (error) {
      setError('Error adding a match:', error);
      console.error('Error adding a match:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeErrorModal = () => {
    setError(null);
  };
    
    
    
  return (
    <div>
      {loading && <Loader />}
      {error && <ErrorModal error={error} onClose={closeErrorModal} />}

          <Button onClick={handleModalAddShow} className="me-2 add_button"><PlusCircle className="add_button__icons"/></Button>
        {/* Модальне вікно для додавання матчу */}
        <div>
          <Modal show={modalAddShow} onHide={handleModalAddClose} dialogClassName="modal-lg">
            <Modal.Header closeButton>
              <Modal.Title>Add a match</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3 top_group_input'>
                <Form.Control
                  className='top_input'
                  type='date'
                  placeholder='Enter the date of the match'
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                />
                <Form.Control
                  className='top_input'
                  type='time'
                  placeholder='Enter the time of the match'
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
              />
                <Form.Control
                  className='top_input'
                  type='text'
                  placeholder='Enter the match stadium'
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3 top_group_input'>
              <Form.Select
                className='top_input'
                value={homeTeamId}
                onChange={(e) => {
                  setHomeTeamId(e.target.value);
                  setAwayTeamsForSelect(teams.filter(team => team.team_id !== parseInt(e.target.value))
                    .sort((a, b) => a.name.localeCompare(b.name)));
                }}
              >
                <option>Select your home team</option>
                {teams.sort((a, b) => a.name.localeCompare(b.name))
                  .map(team => (
                  <option key={team.team_id} value={team.team_id}>{team.name}</option>
                  ))} 
                </Form.Select>
                <Form.Control
                  className='top_input'
                  type='number'
                  placeholder='Enter the number of goals scored by the home team'
                  value={homeTeamGoals}
                  onChange={(e) => setHomeTeamGoals(e.target.value)}
              />
              <div className='top_ture'>-</div>
                <Form.Control
                  className='top_input'
                  type='number'
                  placeholder='Enter the number of goals scored by the away team'
                  value={awayTeamGoals}
                  onChange={(e) => setAwayTeamGoals(e.target.value)}
                />
                <Form.Select
                  className='top_input'
                  value={awayTeamId}
                  onChange={(e) => setAwayTeamId(e.target.value)}
                >
                  <option>Choose a team on the road</option>
                  {awayTeamsForSelect.map(team => (
                    <option key={team.team_id} value={team.team_id}>{team.name}</option>
                    ))} 
                </Form.Select>
            </Form.Group>
            <div className='bottom_group_input'>
              <div>{renderGoalInputsHome()}</div>
              <div>{renderGoalInputsAway()}</div>
            </div>
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






