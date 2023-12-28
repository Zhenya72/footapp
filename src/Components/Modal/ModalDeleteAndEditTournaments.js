import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';
import { Button, Modal, Form } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/MainPage.css'

const ModalDeleteAndEditTournaments = ({ tournaments, fetchUserTournaments }) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [tournamentIdToDelete, setTournamentIdToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTournamentName, setEditTournamentName] = useState(''); // Стейт для зміни назви турніру
  const [loading, setLoading] = useState(false);


  
  const handleDeleteTournament = (e, id) => {
    e.preventDefault();
    setTournamentIdToDelete(id);
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/tournamentsDelete/${tournamentIdToDelete}`); 
      fetchUserTournaments()
      setShowModal(false); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      console.error('Помилка видалення турніру', error);
    } finally {
      setLoading(false);
    }
  };


  // Функція для відкриття модального вікна редагування турніру
  const handleEditTournament = (e, id, currentTournamentName) => {
    e.preventDefault();
    setTournamentIdToDelete(id); // Зберегти ID турніру 
    setEditTournamentName(currentTournamentName); // Встановити поточну назву турніру для редагування
    setShowEditModal(true); // Відкрити модальне вікно
  };

    // Функція для закриття модального вікна
  const handleEditCloseModal = () => {
    setShowEditModal(false);
  };

    // Функція для збереження зміненої назви турніру і відправки на сервер
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:5000/tournamentsEdit/${tournamentIdToDelete}`, { tournamentName: editTournamentName });
      fetchUserTournaments(); // Запитати список турнірів з сервера для оновлення
      setShowEditModal(false); // Закрити модальне вікно після успішного видалення
    } catch (error) {
      console.error('Помилка редагування турніру', error);
    } finally {
      setLoading(false);
    }
  };


  const handleTournamentClick = (tournamentName, tournamentId) => {
    history.push(`/tournament/${tournamentName}/${tournamentId}`); // перехід на окрему сторінку з використанням ідентифікатора турніру
  };


  return (
    <div className='tournaments-grid'>
      {loading && <Loader/>}
      {tournaments && tournaments.length > 0 ? (
        tournaments.sort((a, b) => new Date(b.implementationDate) - new Date(a.implementationDate))
          .map((tournament, index) => (
          <div key={index} className="tournament-card p-2" >
            <div className="tournament-card__click" onClick={() => handleTournamentClick(tournament.tournamentName, tournament.id)}> 

            <h5 className='title'>{tournament.tournamentName}</h5>
            <p>{new Date(tournament.implementationDate).toLocaleDateString()}</p>
            </div>
            <div className="options-menu">
              <Button className='options-btn' onClick={(e) => handleEditTournament(e, tournament.id, tournament.tournamentName)}><Pencil /></Button>
              <Button className='options-btn' onClick={(e) => handleDeleteTournament(e, tournament.id)}><TrashFill /></Button>
            </div>
          </div>
        ))
      ) : (
        <p className='notournaments'>No tournaments available</p>
      )}

          {/* Модальне вікно для видалення турніру*/}
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


      {/* Модальне вікно для редагування назви турніру*/}
      <Modal show={showEditModal} onHide={handleEditCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Редагування назви турніру</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editTournamentName}
            onChange={(e) => setEditTournamentName(e.target.value)}
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


export default ModalDeleteAndEditTournaments;
