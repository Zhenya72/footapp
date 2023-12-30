import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Loader from '../Components/Loader';
import { Button } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'
import ModalAddTournaments from '../Components/Modal/ModalAddTournaments';
import ModalDeleteTournaments from '../Components/Modal/ModalDeleteTournaments';
import ModalEditTournaments from '../Components/Modal/ModalEditTournaments';
import ModalOffcanvas from '../Components/Modal/ModalOffcanvas';

function MainPage(props) {
  const history = useHistory();
  const [tournaments, setTournaments] = useState([]);  // Стейт для збереження турнірів
  const [loading, setLoading] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [tournamentIdToDelete, setTournamentIdToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [TournamentName, setTournamentName] = useState(''); // Стейт для зміни назви турніру
  
  const fetchUserTournaments = async () => {
    setLoading(true);
    try {
      if (props.user) {
        const response = await axios.post('http://127.0.0.1:5000/user-tournaments', { email: props.user.email });
        setTournaments(response.data.userTournaments);
      }
    } catch (error) {
      console.error('Помилка отримання турнірів:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteTournament = (id) => {
    setTournamentIdToDelete(id);
    setModalDeleteShow(true);
  };

  const handleCloseModal = () => {
    setModalDeleteShow(false);
  };



    // Функція для відкриття модального вікна редагування турніру
  const handleEditTournament = (id, currentTournamentName) => {
    setTournamentIdToDelete(id); // Зберегти ID турніру 
    setTournamentName(currentTournamentName); // Встановити поточну назву турніру для редагування
    setShowEditModal(true); // Відкрити модальне вікно
  };

    // Функція для закриття модального вікна
  const handleEditCloseModal = () => {
    setShowEditModal(false);
  };

  const handleTournamentClick = (tournamentName, tournamentId) => {
    history.push(`/tournament/${tournamentName}/${tournamentId}`); // перехід на окрему сторінку з використанням ідентифікатора турніру
    };
  
  
  useEffect(() => {
    if (props.user) {
      fetchUserTournaments();
    }
  }, [props.user]);
  

  
  return (
    <div className='main'>
      {loading && <Loader/>}
      <ModalOffcanvas user={props} />
      
      <h1>Твої чемпіонати</h1>

      {props.user && (
        <ModalAddTournaments email={props.user.email} fetchUserTournaments={fetchUserTournaments} />
      )}
      <div className='tournaments-grid'>
      {props.user && tournaments && tournaments.length > 0 ? (
        tournaments.sort((a, b) => new Date(b.implementationDate) - new Date(a.implementationDate))
          .map((tournament, index) => (
          <div key={index} className="tournament-card p-2" >
            <div className="tournament-card__click" onClick={() => handleTournamentClick(tournament.tournamentName, tournament.id)}> 

            <h5 className='title'>{tournament.tournamentName}</h5>
            <p>{new Date(tournament.implementationDate).toLocaleDateString()}</p>
            </div>
            <div className="options-menu">
              <Button className='options-btn' onClick={() => handleEditTournament(tournament.id, tournament.tournamentName)}><Pencil /></Button>
              <Button className='options-btn' onClick={() => handleDeleteTournament(tournament.id)}><TrashFill /></Button>
            </div>
          </div>
        ))
      ) : (
        <p className='notournaments'>No tournaments available</p>
        )}
        </div>
      {props.user && (
        <ModalDeleteTournaments modalDeleteShow={modalDeleteShow} tournamentIdToDelete={tournamentIdToDelete} handleCloseModal={handleCloseModal} fetchUserTournaments={fetchUserTournaments} />
      )}
      {props.user && (
        <ModalEditTournaments showEditModal={showEditModal} tournamentIdToDelete={tournamentIdToDelete} TournamentName={TournamentName} handleEditCloseModal={handleEditCloseModal}  fetchUserTournaments={fetchUserTournaments} />
      )}

    </div>
  );
}

export default MainPage;
