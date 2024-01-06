import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import ErrorModal from '../Components/ErrorModal';
import { Table, Button, Accordion } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import ModalAddMatch from '../Components/Modal/ModalAddMatch';
import './Pages.css'

const Matches = ({ tournamentId, teams, players, AllMatches, StatisticsGoals, StatisticsAsists, standings }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);  // Стейт для збереження матчів

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/matches', { tournamentId: tournamentId });
      setMatches(response.data.matches);
      AllMatches(response.data.matches);
      StatisticsGoals();
      StatisticsAsists();
      standings();
    } catch (error) {
      setError('Match receipt error:', error);
      console.error('Match receipt error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const closeErrorModal = () => {
    setError(null);
  };

  return (
    <div className='cont'>
      {loading && <Loader />}
      {error && <ErrorModal error={error} onClose={closeErrorModal} />}
      

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
                        {match.goals && match.goals.length > 0 && (
                          <tr>
                            <td colSpan={3}>
                              {match.goals.map((goal, index) => {
                                const goalPlayer = players.find(player => player.player_id === parseInt(goal.player_id));
                                const assistant = match.assistants.find(assist => assist.time_of_assist === goal.time_of_goal);

                                if (goalPlayer && goalPlayer.team_id === match.home_team_id) {
                                  return (
                                    <p key={index}>
                                      {` ${goal.time_of_goal}' ${goalPlayer.last_name || 'Unknown Player'}`}
                                      {assistant && (
                                        <>
                                          {' '}
                                          ({assistant.player_id && players.find(player => player.player_id === parseInt(assistant.player_id)).team_id === match.home_team_id
                                            ? players.find(player => player.player_id === parseInt(assistant.player_id)).last_name || 'Unknown Assistant'
                                            : 'Unknown Assistant'})
                                        </>
                                      )}
                                      <br />
                                    </p>
                                  );
                                }
                                return null; // If the player is not found or does not belong to the home team
                              })}
                            </td>
                            <td></td>
                            <td colSpan={3}>
                              {match.goals.map((goal, index) => {
                                const goalPlayer = players.find(player => player.player_id === parseInt(goal.player_id));
                                const assistant = match.assistants.find(assist => assist.time_of_assist === goal.time_of_goal);

                                if (goalPlayer && goalPlayer.team_id === match.away_team_id) {
                                  return (
                                    <p key={index}>
                                      {` ${goal.time_of_goal}' ${goalPlayer.last_name || 'Unknown Player'}`}
                                      {assistant && (
                                        <>
                                          {' '}
                                          ({assistant.player_id && players.find(player => player.player_id === parseInt(assistant.player_id)).team_id === match.away_team_id
                                            ? players.find(player => player.player_id === parseInt(assistant.player_id)).last_name || 'Unknown Assistant'
                                            : 'Unknown Assistant'})
                                        </>
                                      )}
                                      <br />
                                    </p>
                                  );
                                }
                                return null; // If the player is not found or does not belong to the home team
                              })}
                            </td>
                          </tr>
                        )}                                                
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
        <p className='not'>Add teams and players first</p>
      )}      
      
    </div>



  );
};


export default Matches;