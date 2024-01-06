import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/MainPage.css'

const ModalDeleteTournaments = ({ modalDeleteShow, tournamentIdToDelete, handleCloseModal, fetchUserTournaments }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/tournamentsDelete/${tournamentIdToDelete}`); 
      fetchUserTournaments()
      handleCloseModal(); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      setError('Tournament deletion error', error);
      console.error('Tournament deletion error', error);
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
          <Modal.Title>Tournament deletion confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the tournament?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmDelete}>Confirm the deletion</Button>
        </Modal.Footer>
      </Modal>

      </div>
  );
};


export default ModalDeleteTournaments;
