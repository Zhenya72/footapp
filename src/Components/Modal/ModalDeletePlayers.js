import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalDeletePlayers = ({ modalDeleteShow, playerId, handleCloseModal, fetchPlayers }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const deleteTeams = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/playersDelete/${playerId}`); 
      fetchPlayers()
      handleCloseModal(); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      setError('Player deletion error', error);
      console.error('Player deletion error', error);
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
      <Modal show={modalDeleteShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation of player removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete a player?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={deleteTeams}>Confirm the deletion</Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};

export default ModalDeletePlayers;




