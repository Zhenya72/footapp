import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { HouseFill } from 'react-bootstrap-icons';
import './Tournament.css';
import Standings from './Standings';
import Statistics from './Statistics';
import Matches from './Matches';
import Teams from './Teams';
import Players from './Players';


const Tournament = () => {
  const history = useHistory();
  const { tournamentName } = useParams();
  const { tournamentId } = useParams();
  const [key, setKey] = useState('standings');

    const handleLogout = () => {
    // Перенаправлення користувача на головну сторінку
    history.push('/main');
  };

  return (
    <div className='tournament'>
      <h2 className='title'>{tournamentName}</h2>
      <Button className='house_btn' onClick={handleLogout}><HouseFill className='house_btn__icons' /></Button>

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 tabs"
        justify
        fill
      >
        <Tab eventKey="standings" title="Standings">
          <Standings tournamentId={ tournamentId } />
        </Tab>
        <Tab eventKey="statistics" title="Statistics">
          <Statistics tournamentId={ tournamentId } />
        </Tab>
        <Tab eventKey="matches" title="Matches">
          <Matches tournamentId={ tournamentId } />
        </Tab>
        <Tab eventKey="teams" title="Teams">
          <Teams tournamentId={ tournamentId } />
        </Tab>
        <Tab eventKey="players" title="Players">
          <Players tournamentId={ tournamentId } />
        </Tab>
      </Tabs>
    </div>

  );
};


export default Tournament;
