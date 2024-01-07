import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Loader from '../Components/Loader';
import ErrorModal from '../Components/ErrorModal';
import './Pages.css'


const Calendar = ({ teams, tournament_id }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchCalendar, setMatchCalendar] = useState([]);



  const createCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/create-match-calendar', { tournament_id: tournament_id });
      fetchCalendar();
    } catch (error) {
      setError('Error receiving commands:', error);
      console.error('Error receiving commands:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/fetch-match-calendar', { tournament_id: tournament_id });
      setMatchCalendar(response.data);
    } catch (error) {
      setError('Error receiving commands:', error);
      console.error('Error receiving commands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const closeErrorModal = () => {
    setError(null);
  };

  

  return (
    <div className='cont'>
      {loading && <Loader />}
      {error && <ErrorModal error={error} onClose={closeErrorModal} />}
      {teams && teams.length > 1 ? (  
        <>
          <div className='calendar_btn'>
        <Button onClick={createCalendar}>Update the calendar</Button>
          </div>
          {matchCalendar && matchCalendar.length > 2 ? (
            <>
            <Table striped bordered hover>
              <thead style={{ textAlign: 'center' }}>
                <tr className="align-middle">
                  <th>Round</th>
                  <th>Club home</th>
                  <th>Club away</th>
                </tr>
              </thead>
              <tbody>                  
                  {matchCalendar.map((match, index) => (
                  <tr key={`${match.round_number}-${index}`}>
                    <td>{match.round_number}</td>
                    <td>{match.home_team_id && teams.find(team => team.team_id === match.home_team_id)?.name}</td>
                    <td>{match.away_team_id && teams.find(team => team.team_id === match.away_team_id)?.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </>  
          ) : (
            <p className='not'>Update your calendar</p>
          )}
        </>
      ) : (
        <p className='not'>Add the following commands first</p>
      )}
    </div>
  );
};


export default Calendar;
