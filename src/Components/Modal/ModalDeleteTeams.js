import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalDeleteTeams = ({ modalDeleteShow, teamId, handleCloseModal, fetchTeams }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const deleteTeams = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/teamsDelete/${teamId}`); 
      fetchTeams()
      handleCloseModal(); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      setError('Error deleting a command', error);
      console.error('Error deleting a command', error);
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
          <Modal.Title>Confirmation of command deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the team?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={deleteTeams}>Confirm the deletion</Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};

export default ModalDeleteTeams;




