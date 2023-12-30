
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Table, Button } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import ModalAddTeams from '../Components/Modal/ModalAddTeams';
import ModalDeleteTeams from '../Components/Modal/ModalDeleteTeams'
import ModalEditTeams from '../Components/Modal/ModalEditTeams'
import './Pages.css'

const Teams = ({ tournamentId, AllTeams }) => {
  const [teams, setTeams] = useState([]);  // Стейт для збереження команд
  const [loading, setLoading] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [name, setName] = useState('');  
  const [country, setCountry] = useState('');  
  const [yearOfFoundation, setyearOfFoundation] = useState('');  
  const [coach, setCoach] = useState('');  
  const [modalEditShow, setModalEdiShow] = useState(false);


  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/teams', { tournamentId: tournamentId });
      setTeams(response.data.teams);
      AllTeams(response.data.teams);
    } catch (error) {
      console.error('Помилка отримання турніру:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (teamId) => {
    setModalDeleteShow(true)
    setTeamId(teamId);
  };

  const handleCloseModal = () => {
    setModalDeleteShow(false);
  };



  const handleEditShowModalt = (id, name, country, yearOfFoundation, coach) => {
    setTeamId(id); // Зберегти ID турніру 
    setName(name); 
    setCountry(country); 
    setyearOfFoundation(yearOfFoundation); 
    setCoach(coach); 
    setModalEdiShow(true); // Відкрити модальне вікно
  };

  const handleElitCloseModal = () => {
    setModalEdiShow(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);



  return (
    <div className='cont'>
      {loading && <Loader/>}
      <ModalAddTeams tournamentId={tournamentId} fetchTeams={fetchTeams} />

      {teams && teams.length > 0 ? (   
        <Table striped bordered hover>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>Year of Foundation</th>
              <th>Coach</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {teams.sort((a, b) => a.name.localeCompare(b.name))
              .map(team => (
              <tr key={team.team_id}>
                <td>{team.name}</td>
                <td>{team.country}</td>
                <td>{team.yearOfFoundation}</td>
                <td>{team.coach}</td>
                <td><Button className='options-btn' onClick={() => handleEditShowModalt(team.team_id, team.name, team.country, team.yearOfFoundation, team.coach)}><Pencil /></Button></td>
                <td><Button className='options-btn' onClick={() => handleShowModal(team.team_id)}><TrashFill /></Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
        ) : (
        <p className='not'>There are no commands</p>
      )}

        <ModalDeleteTeams modalDeleteShow={modalDeleteShow} teamId={teamId} handleCloseModal={handleCloseModal} fetchTeams={ fetchTeams } />
        <ModalEditTeams modalEditShow={modalEditShow} teamId={teamId} name={name} country={country} yearOfFoundation={yearOfFoundation} coach={coach} handleElitCloseModal={handleElitCloseModal} fetchTeams={ fetchTeams } />
    </div>

  );
};


export default Teams;
