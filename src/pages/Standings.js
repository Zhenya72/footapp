
import { Table } from 'react-bootstrap';
import './Pages.css'


const Standings = ({standingsTeams}) => {


  return (
    <div className='cont'>
      {standingsTeams && standingsTeams.length > 0 ? (  
        <Table striped bordered hover>
          <thead style={{ textAlign: 'center' }}>
            <tr className="align-middle">
              <th>№</th>
              <th>Club</th>
              <th>I</th>
              <th>IN</th>
              <th>N</th>
              <th>P</th>
              <th>MP</th>
              <th>RM</th>
              <th>AT</th>
              <th>Ministry <br/> of <br/> Health</th>
            </tr>
          </thead>
            <tbody>
              {standingsTeams.sort((a, b) => b.points - a.points)
                .map((team, index) => {
                  return (
                    <tr key={team.team_id}>
                      <td>{index+1}</td>
                      <td>{team.name}</td>
                      <td>{team.games}</td>
                      <td>{team.victories}</td>
                      <td>{team.nobodys}</td>
                      <td>{team.defeats}</td>
                      <td>{team.goals_scored}</td>
                      <td>{team.missed_balls}</td>
                      <td>{team.goal_difference}</td>
                      <td>{team.points}</td>
                    </tr>
                  );
                })}
            </tbody>
        </Table>
                ) : (
        <p className='not'>Add the following commands first</p>
      )}


      
    </div>



  );
};


export default Standings;
