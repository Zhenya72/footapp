import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import { PlusCircle } from 'react-bootstrap-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Teams.css'

const ModalEditTeams = ({ tournamentId, fetchTeams }) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [name, setName] = useState('');  
  const [country, setCountry] = useState('');  
  const [yearOfFoundation, setyearOfFoundation] = useState('');  
  const [coach, setCoach] = useState('');  
  const [loading, setLoading] = useState(false);
  
  const handleModalAddClose = () => {
    setModalAddShow(false);
    setName('');
    setCountry('');
    setyearOfFoundation('');
    setCoach('');
  } 
  const handleModalAddShow = () => {
    setModalAddShow(true);
    setName('');
    setCountry('');
    setyearOfFoundation('');
    setCoach('');
  } 


  const addTeams = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://127.0.0.1:5000/add-teams`, {'tournamentId': tournamentId, 'name': name, 'country': country, 'yearOfFoundation': yearOfFoundation, 'coach': coach, 'games': 0, 'victories': 0, 'nobodys': 0, 'defeats': 0, 'goalsScored': 0, 'missedBalls': 0, 'goalDifference': 0, 'points': 0});
      fetchTeams();
      handleModalAddClose();
    } catch (error) {
      console.error('Помилка додавання команди:', error);
    } finally {
      setLoading(false);
    }
  };
    
    
  return (
    <div>
      {loading && <Loader />}
      <Modal show={showEditModal} onHide={handleEditCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Редагування команди</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type='text'
            value={name}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Form.Control
            type='text'
            value={country}
            onChange={(e) => setEditCountry(e.target.value)}
          />
          <Form.Control
            type='number'
            value={yearOfFoundation}
            onChange={(e) => {
              const inputYear = e.target.value;
              if (inputYear.length <= 4) {
                setEdityearOfFoundation(inputYear);
              }
            }}
          />
          <Form.Control
            type='text'
            value={coach}
            onChange={(e) => setEditCoach(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditCloseModal}>Скасувати</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Підтвердити редагування</Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};

export default ModalEditTeams;




