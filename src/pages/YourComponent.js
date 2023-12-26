import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import './MainPage.css'

const YourComponent = ({ tournaments }) => {
  const [showModal, setShowModal] = useState(false);
  const [tournamentIdToDelete, setTournamentIdToDelete] = useState(null);

  const handleDeleteTournament = (e, id) => {
    e.preventDefault();
    setTournamentIdToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/tournamentsDelete/${tournamentIdToDelete}`); // Приклад URL для видалення турніру
      // Виконайте необхідні дії після успішного видалення, наприклад оновлення списку турнірів
      setShowModal(false); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      console.error('Помилка видалення турніру', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='tournaments-grid'>
      {tournaments && tournaments.length > 0 ? (
        tournaments.map((tournament, index) => (
          <div key={index} className="tournament-card p-2">
            <h5 className='title'>{tournament.tournamentName}</h5>
            <p>{new Date(tournament.implementationDate).toLocaleDateString()}</p>
            <div className="options-menu">
              <Button className='options-btn'><Pencil style={{ color: 'black' }} /></Button>
              <Button className='options-btn' onClick={(e) => handleDeleteTournament(e, tournament.id)}><TrashFill style={{ color: 'black' }} /></Button>
            </div>
          </div>
        ))
      ) : (
        <p>No tournaments available</p>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
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

export default YourComponent;
