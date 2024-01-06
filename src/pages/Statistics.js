
import { Table } from 'react-bootstrap';
import './Pages.css'
const Statistics = ({ top5Scorers, top5Asists, teams, players, matches }) => {

  return (
    <div className='cont'>
      {matches && matches.length > 0 ? (
        <>
          <div>
          {top5Scorers && top5Scorers.length > 0 ? (  
        <Table striped bordered hover>
          <caption style={{ captionSide: 'top', textAlign: 'center', fontWeight: 'bold', color: 'black' }}>Goals</caption>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>№</th>
              <th>Player</th>
              <th>Club</th>
              <th>Goals</th>
            </tr>
          </thead>
            <tbody>
            {top5Scorers.map((player, index) => {
                const playergoal = players.find(playergoal => playergoal.player_id === parseInt(player.player_id));
                const team = teams.find(team => team.team_id === parseInt(player.team_id));
                  return (
                    <tr key={player.player_id}>
                      <td>{index+1}</td>
                      <td>{playergoal ? `${playergoal.first_name} ${playergoal.last_name}` : 'Player Not Found'}</td>
                      <td>{team ? team.name : 'Team Not Found'}</td>
                      <td>{player.goals}</td>
                    </tr>
                  );
                })}
            </tbody>
        </Table>
                ) : (
        <p className='nottop'>No goal statistics yet</p>
            )}
            </div>  

            <div>
      {top5Asists && top5Asists.length > 0 ? (  
        <Table striped bordered hover>
          <caption style={{ captionSide: 'top', textAlign: 'center', fontWeight: 'bold', color: 'black' }}>Goal passes</caption>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>№</th>
              <th>Player</th>
              <th>Club</th>
              <th>Goal passes</th>
            </tr>
          </thead>
            <tbody>
            {top5Asists.map((player, index) => {
                const playerasist = players.find(playerasist => playerasist.player_id === parseInt(player.player_id));
                const team = teams.find(team => team.team_id === parseInt(player.team_id));
                  return (
                    <tr key={player.player_id}>
                      <td>{index+1}</td>
                      <td>{playerasist ? `${playerasist.first_name} ${playerasist.last_name}` : 'Player Not Found'}</td>
                      <td>{team ? team.name : 'Team Not Found'}</td>
                      <td>{player.asist}</td>
                    </tr>
                  );
                })}
            </tbody>
        </Table>
                ) : (
        <p className='notbottom'>No statistics on assistants yet</p>
          )}
          </div>

      </>
        ) : (
        <p className='not'>Add matches first</p>
      )}
      
    </div>




  );
};


export default Statistics;