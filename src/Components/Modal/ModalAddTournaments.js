import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { PlusCircle } from 'react-bootstrap-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/MainPage.css'

const ModalAddTournaments = ({ email, fetchUserTournaments }) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [newTournamentName, setNewTournamentName] = useState('');  // Стейт для збереження назви нового турніру
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleModalAddClose = () => {
    setModalAddShow(false);
    setNewTournamentName('');
  } 
  const handleModalAddShow = () => {
    setModalAddShow(true);
    setNewTournamentName('');
  } 

  const addTournament = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:5000/add-tournament', { email: email, tournament_name: newTournamentName });
      fetchUserTournaments();
      handleModalAddClose();
    } catch (error) {
      setError('Error adding a tournament:', error);
      console.error('Error adding a tournament:', error);
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
        {/* Модальне вікно для додавання турніру */}
        <div>
          <Modal show={modalAddShow} onHide={handleModalAddClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a tournament</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder='Enter the name of the tournament'
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalAddClose}>
                Закрити
              </Button>
              <Button variant="primary" onClick={addTournament}>
                Додати
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
          </div>
  );
};

export default ModalAddTournaments;
