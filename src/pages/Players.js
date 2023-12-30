import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Table, Button } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import ModalAddPlayer from '../Components/Modal/ModalAddPlayer';
import ModalDeletePlayers from '../Components/Modal/ModalDeletePlayers'
import ModalEditPlayers from '../Components/Modal/ModalEditPlayers'
import './Pages.css'

const Players = ({tournamentId, teams, AllPlayers}) => {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);  // Стейт для збереження команд
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [firstName, setFirstName] = useState('');  
  const [lastName, setLastName] = useState(''); 
  const [teamId, setTeamId] = useState(0);
  const [position, setPosition] = useState('');  
  const [birthday, setBirthday] = useState('');  
  const [height, setHeight] = useState('');  
  const [weight, setWeight] = useState('');  
  const [gameNumber, setGameNumber] = useState(''); 
  const [modalEditShow, setModalEdiShow] = useState(false);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/players', { tournamentId: tournamentId });
      setPlayers(response.data.players);
      AllPlayers(response.data.players);
    } catch (error) {
      console.error('Помилка отримання турніру:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (playerId) => {
    setModalDeleteShow(true)
    setPlayerId(playerId);
  };

  const handleCloseModal = () => {
    setModalDeleteShow(false);
  };

  const handleEditShowModalt = (id, firstName, lastName, teamId, position, birthday, height, weight, gameNumber) => {
    setPlayerId(id); // Зберегти ID гравця 
    setFirstName(firstName); 
    setLastName(lastName); 
    setTeamId(teamId);
    setPosition(position); 
    setBirthday(birthday); 
    setHeight(height); 
    setWeight(weight); 
    setGameNumber(gameNumber); 
    setModalEdiShow(true); // Відкрити модальне вікно
  };

  const handleElitCloseModal = () => {
    setModalEdiShow(false);
  };


  useEffect(() => {
    fetchPlayers();
  }, []);



  return (    
    <div className='cont'>
      {loading && <Loader />}
      {teams && teams.length > 0 ? (
      <>
        <ModalAddPlayer teams={teams} fetchPlayers={fetchPlayers} />
      {players && players.length > 0 ? (   
        <Table striped bordered hover>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Team</th>
              <th>Position</th>
              <th>Birthday</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Game Number</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
            <tbody>
              {players.sort((a, b) => a.first_name.localeCompare(b.first_name))
                .map(player => {
                  const foundTeam = teams.find(team => team.team_id === player.team_id);
                  return (
                    <tr key={player.player_id}>
                      <td>{player.first_name}</td>
                      <td>{player.last_name}</td>
                      <td>{foundTeam ? foundTeam.name : 'Team Not Found'}</td>
                      <td>{player.position}</td>
                      <td>{player.birthday}</td>
                      <td>{player.height} cm</td>
                      <td>{player.weight} kg</td>
                      <td>{player.game_number}</td>
                      <td><Button className='options-btn' onClick={() => handleEditShowModalt(player.player_id, player.first_name, player.last_name, player.team_id, player.position, player.birthday, player.height, player.weight, player.game_number)}><Pencil /></Button></td>
                      <td><Button className='options-btn' onClick={() => handleShowModal(player.player_id)}><TrashFill /></Button></td>
                    </tr>
                  );
                })}
            </tbody>
        </Table>
                ) : (
        <p className='not'>There are no players</p>
      )}
      </>
        ) : (
        <p className='not'>Добавте спочатку команди</p>
      )}




      <ModalDeletePlayers modalDeleteShow={modalDeleteShow} playerId={playerId} handleCloseModal={handleCloseModal} fetchPlayers={fetchPlayers} />
      <ModalEditPlayers modalEditShow={modalEditShow} playerId={playerId} firstName={firstName} lastName={lastName} teamId={teamId} position={position} birthday={birthday} height={height} weight={weight} gameNumber={gameNumber} handleElitCloseModal={handleElitCloseModal} fetchPlayers={ fetchPlayers } teams={teams} />
      
    </div>



  );
};


export default Players;



      