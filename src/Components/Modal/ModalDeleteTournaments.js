import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/MainPage.css'

const ModalDeleteTournaments = ({ modalDeleteShow, tournamentIdToDelete, handleCloseModal, fetchUserTournaments }) => {
  const [loading, setLoading] = useState(false);


  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/tournamentsDelete/${tournamentIdToDelete}`); 
      fetchUserTournaments()
      handleCloseModal(); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      console.error('Помилка видалення турніру', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {loading && <Loader />}
      
      <Modal show={modalDeleteShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Підтвердження видалення турніру</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ви впевнені, що бажаєте видалити турнір?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Скасувати</Button>
          <Button variant="primary" onClick={handleConfirmDelete}>Підтвердити видалення</Button>
        </Modal.Footer>
      </Modal>

      </div>
  );
};


export default ModalDeleteTournaments;
