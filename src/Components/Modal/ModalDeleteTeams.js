import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Teams.css'

const ModalDeleteTeams = ({ modalDeleteShow, teamId, handleCloseModal, fetchTeams }) => {
  const [loading, setLoading] = useState(false);
  
  const deleteTeams = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/teamsDelete/${teamId}`); 
      fetchTeams()
      handleCloseModal(); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      console.error('Помилка видалення команди', error);
    } finally {
      setLoading(false);
    }
  };

    
  return (
    <div>
      {loading && <Loader/>}
      <Modal show={modalDeleteShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Підтвердження видалення команди</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ви впевнені, що бажаєте видалити команду?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Скасувати</Button>
          <Button variant="primary" onClick={deleteTeams}>Підтвердити видалення</Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};

export default ModalDeleteTeams;




