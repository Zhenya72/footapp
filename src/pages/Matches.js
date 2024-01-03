import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Table, Button, Accordion } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import ModalAddMatch from '../Components/Modal/ModalAddMatch';
// import ModalDeleteMatch from '../Components/Modal/ModalDeletePlayers'
// import ModalEditMatch from '../Components/Modal/ModalEditPlayers'
import './Pages.css'

const Matches = ({ tournamentId, teams, players, AllMatches, StatisticsGoals, StatisticsAsists }) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);  // Стейт для збереження матчів

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/matches', { tournamentId: tournamentId });
      setMatches(response.data.matches);
      AllMatches(response.data.matches);
      StatisticsGoals();
      StatisticsAsists();
    } catch (error) {
      console.error('Помилка отримання матчу:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);


  return (
    <div className='cont'>
      {loading && <Loader />}
      

      {teams && teams.length > 0 && players && players.length > 0  ? (
      <>
        <ModalAddMatch teams={teams} players={players} fetchMatches={fetchMatches} />
      {matches && matches.length > 0 ? (   
            <Table bordered>
              <tbody>
              {matches.sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
                  .map(match => {
                    const foundTeamHome = teams.find(team => team.team_id === match.home_team_id);
                    const foundTeamAway = teams.find(team => team.team_id === match.away_team_id);
                    // const goals = goals.filter(goal => goal.match_id === match.match_id);
                    // const assists = assists.filter(assist => assist.match_id === match.match_id);

                    return (
                      <React.Fragment key={match.match_id}>
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center' }}>{match.match_date} {match.match_time}</td>
                        </tr>
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center' }}>{match.stadium}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>{foundTeamHome ? foundTeamHome.name : 'Team Not Found'}</td>
                          <td>{match.home_team_goals}</td>
                          <td>-</td>
                          <td>{match.away_team_goals}</td>
                          <td colSpan={2}>{foundTeamAway ? foundTeamAway.name : 'Team Not Found'}</td>
                        </tr>
                        {/* {goals.map(goal => (
                          <tr key={goal.goal_id}>
                            <td>{goal.time_of_goal}</td>
                            <td>{goal.player_id}</td>
                            <td>{
                              assists.find(assist => assist.goal_id === goal.goal_id && assist.team_id === goal.team_id)
                                ? assists.find(assist => assist.goal_id === goal.goal_id && assist.team_id === goal.team_id).player_id
                                : ''
                              }</td>
                            <td></td>
                            <td>{goal.time_of_goal}</td>
                            <td>{goal.player_id}</td>
                            <td>{
                              assists.find(assist => assist.goal_id === goal.goal_id && assist.team_id === goal.team_id)
                                ? assists.find(assist => assist.goal_id === goal.goal_id && assist.team_id === goal.team_id).player_id
                                : ''
                              }</td>
                          </tr>
                        ))} */}
                        
                      </React.Fragment>
                  );
                })}
            </tbody>
        </Table>
                ) : (
        <p className='not'>There are no matches</p>
      )}
      </>
        ) : (
        <p className='not'>Добавте спочатку команди та гравців</p>
      )}



      
      
      
    </div>



  );
};


export default Matches;