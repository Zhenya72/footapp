import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { PlusCircle } from 'react-bootstrap-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalAddPlayer = ({ teams, fetchPlayers }) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [firstName, setFirstName] = useState('');  
  const [lastName, setLastName] = useState('');  
  const [teamId, setTeamId] = useState(0);  
  const [position, setPosition] = useState('');  
  const [birthday, setBirthday] = useState('');  
  const [height, setHeight] = useState('');  
  const [weight, setWeight] = useState('');  
  const [gameNumber, setGameNumber] = useState('');  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleModalAddClose = () => {
    setModalAddShow(false);
    setFirstName('');
    setLastName('');
    setTeamId(0)
    setPosition('')
    setBirthday('');
    setHeight('');
    setWeight('');
    setGameNumber('');
  } 
  const handleModalAddShow = () => {
    setModalAddShow(true);
    setFirstName('');
    setLastName('');
    setTeamId(0)
    setPosition('')
    setBirthday('');
    setHeight('');
    setWeight('');
    setGameNumber('');
  } 


  const addPlayer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://127.0.0.1:5000/add-player`, { 'firstName': firstName, 'lastName': lastName, 'teamId': parseInt(teamId), 'position': position, 'birthday': new Date(birthday).toISOString().split('T')[0], 'height': parseFloat(height), 'weight': parseFloat(weight), 'gameNumber': parseInt(gameNumber)});
      fetchPlayers();
      handleModalAddClose();
    } catch (error) {
      setError('Error adding a player:', error);
      console.error('Error adding a player:', error);
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
        {/* Модальне вікно для додавання команди */}
        <div>
          <Modal show={modalAddShow} onHide={handleModalAddClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a player</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder="Enter the player's name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder="Enter the player's last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}>
                <option>Select a team</option>
                {teams.sort((a, b) => a.name.localeCompare(b.name))
                  .map(team => (
                  <option key={team.team_id} value={team.team_id}>{team.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Select
                value={position}
                onChange={(e) => setPosition(e.target.value)} aria-label="Default select example">
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
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder="Enter the player's height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
              />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder="Enter the player's weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='number'
                  placeholder="Enter the player's game number"
                  value={gameNumber}
                  onChange={(e) => setGameNumber(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalAddClose}>
                Закрити
              </Button>
              <Button variant="primary" onClick={addPlayer}>
                Додати
              </Button>
            </Modal.Footer>
        </Modal>
      </div>
          </div>
  );
};

export default ModalAddPlayer;




