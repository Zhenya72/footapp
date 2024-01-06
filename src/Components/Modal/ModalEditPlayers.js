import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalEditPlayers = ({ modalEditShow, playerId, firstName, lastName, teamId, position, birthday, height, weight, gameNumber, handleElitCloseModal, fetchPlayers, teams }) => {
 
  const [editFirstName, setEditFirstName] = useState('');  
  const [editLastName, setEditLastName] = useState(''); 
  const [editTeamId, setEditTeamId] = useState(0);
  const [editPosition, setEditPosition] = useState('');  
  const [editBirthday, setEditBirthday] = useState('');  
  const [editHeight, setEditHeight] = useState('');  
  const [editWeight, setEditWeight] = useState('');  
  const [editGameNumber, setEditGameNumber] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (firstName) {
      setEditFirstName(firstName);
    }
    if (lastName) {
      setEditLastName(lastName);
    }
    if (teamId) {
      setEditTeamId(teamId);
    }
    if (position) {
      setEditPosition(position);
    }
    if (birthday) {
      setEditBirthday(birthday);
    }
    if (height) {
      setEditHeight(height);
    }
    if (weight) {
      setEditWeight(weight);
    }
    if (gameNumber) {
      setEditGameNumber(gameNumber);
    }
  }, [firstName, lastName, teamId, position, birthday, height, weight, gameNumber]);


  const editPlayers = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:5000/edit-players/${playerId}`, {'firstName': editFirstName, 'lastName': editLastName, 'teamId': parseInt(editTeamId), 'position': editPosition, 'birthday': new Date(editBirthday).toISOString().split('T')[0], 'height': parseFloat(editHeight), 'weight': parseFloat(editWeight), 'gameNumber': parseInt(editGameNumber)});
      fetchPlayers();
      handleElitCloseModal();
    } catch (error) {
      setError('Player editing error:', error);
      console.error('Player editing error:', error);
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
      {teams && teams.length > 0 ? (
      <Modal show={modalEditShow} onHide={handleElitCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editing a player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder="Enter the player's name"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder="Enter the player's last name"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Select
                value={editTeamId}
                onChange={(e) => setEditTeamId(e.target.value)}>
                <option>Select a team</option>
                {teams.sort((a, b) => a.name.localeCompare(b.name))
                  .map(team => (
                  <option key={team.team_id} value={team.team_id}>{team.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Select
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)} aria-label="Default select example">
                  <option>Select a position</option>
                  <option value="GK">GK – goalkeeper</option>
                  <option value="CB">CB – centre back</option>
                  <option value="LB">LB – left back</option>
                  <option value="RB">RB – right back</option>
                  <option value="LWB">LWB – left wingback</option>
                  <option value="RWB">RWB – right wingback</option>
                  <option value="CDM">CDM – centre defensive midfielder</option>
                  <option value="CM">CM – centre midfielder</option>
                  <option value="LM">LM – left midfielder</option>
                  <option value="RM">RM – right midfielder</option>
                  <option value="CAM">CAM – central attacking midfielder</option>
                  <option value="ST">ST – striker</option>
                  <option value="CF">CF – centre-forward</option>
                  <option value="LW">LW – left winger</option>
                  <option value="RW">RW – right winger</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='date'
                  placeholder="Enter the player's date of birth"
                  value={editBirthday}
                  onChange={(e) => setEditBirthday(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder="Enter the player's height"
                  value={editHeight}
                  onChange={(e) => setEditHeight(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder="Enter the player's weight"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder="Enter the player's game number"
                  value={editGameNumber}
                  onChange={(e) => setEditGameNumber(e.target.value)}
                />
              </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleElitCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={editPlayers}>Confirm the edit</Button>
        </Modal.Footer>
        </Modal>
        ): (
        <p className='not'></p>
      )}
      </div>
  );
};

export default ModalEditPlayers;




