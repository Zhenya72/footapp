import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/MainPage.css'

const ModalEditTournaments = ({ showEditModal, tournamentIdToDelete, TournamentName, handleEditCloseModal, fetchUserTournaments }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTournamentName, setEditTournamentName] = useState(''); // Стейт для зміни назви турніру

  useEffect(() => {
    if (TournamentName) {
      setEditTournamentName(TournamentName);
    }
  }, [TournamentName]);



    // Функція для збереження зміненої назви турніру і відправки на сервер
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:5000/tournamentsEdit/${tournamentIdToDelete}`, { tournamentName: editTournamentName });
      fetchUserTournaments(); // Запитати список турнірів з сервера для оновлення
      handleEditCloseModal(); // Закрити модальне вікно після успішного редагування
    } catch (error) {
      setError('Tournament editing error', error);
      console.error('Tournament editing error', error);
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

      <Modal show={showEditModal} onHide={handleEditCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editing the tournament name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3'>
          <Form.Control
              type="text"
              placeholder='Enter the name of the tournament'
              value={editTournamentName}
              onChange={(e) => setEditTournamentName(e.target.value)}
          />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Confirm the edit</Button>
        </Modal.Footer>
        </Modal>
      </div>
  );
};


export default ModalEditTournaments;
