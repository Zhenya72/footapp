import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
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
  const [teams, setTeams] = useState([]);  // Стейт для збереження команд
  const [players, setPlayers] = useState([]);  // Стейт для збереження команд
  const [matches, setMatches] = useState([]);  // Стейт для збереження матчів
  const history = useHistory();
  const { tournamentName } = useParams();
  const { tournamentId } = useParams();
  const [key, setKey] = useState('standings');


  const [loading, setLoading] = useState(false);
  const [standingsTeams, setStandingsTeams] = useState([]);  // Стейт для збереження команд

  const standings = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/standings', { tournamentId: tournamentId });
      setStandingsTeams(response.data.standings);
    } catch (error) {
      console.error('Помилка отримання команд:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [top5Scorers, setTop5Scorers] = useState([]); // Moved top5Scorers to state
  const [top5Asists, setTop5Asists] = useState([]); // Moved top5Asists to state

  const StatisticsGoals = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/statisticsGoals', { tournamentId: tournamentId });
      // Згрупуємо голи за player_id та підрахуємо їх кількість
      const playerGoalsCount = response.data.goals_data.reduce((acc, goal) => {
        if (acc[goal.player_id]) {
          acc[goal.player_id]++;
        } else {
          acc[goal.player_id] = 1;
        }
        return acc;
      }, {});

      // Створимо масив з player_id та кількістю забитих голів
      const topScorers = Object.keys(playerGoalsCount).map(playerId => ({
        player_id: playerId,
        goals: playerGoalsCount[playerId],
        team_id: response.data.goals_data.find(goal => goal.player_id === parseInt(playerId)).team_id
      }));

      // Відсортуємо та виберемо перших 5 кращих бомбардирів
      const top5Scorers = topScorers.sort((a, b) => b.goals - a.goals).slice(0, 5);
      setTop5Scorers(top5Scorers);
    } catch (error) {
      console.error('Помилка отримання голів:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatisticsAsists = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/statisticsAsists', { tournamentId: tournamentId });
      // Згрупуємо асисти за player_id та підрахуємо їх кількість
      const playerAsistsCount = response.data.assistants_data.reduce((acc, asist) => {
        if (acc[asist.player_id]) {
          acc[asist.player_id]++;
        } else {
          acc[asist.player_id] = 1;
        }
        return acc;
      }, {});

      // Створимо масив з player_id та кількістю асиситів
      const topAsists = Object.keys(playerAsistsCount).map(playerId => ({
        player_id: playerId,
        asist: playerAsistsCount[playerId],
        team_id: response.data.assistants_data.find(asist => asist.player_id === parseInt(playerId)).team_id
      }));

      // Відсортуємо та виберемо перших 5 кращих асистентів
      const top5Asists = topAsists.sort((a, b) => b.asist - a.asist).slice(0, 5);
      setTop5Asists(top5Asists);
    } catch (error) {
      console.error('Помилка отримання асистентів:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    standings();
    StatisticsGoals();
    StatisticsAsists();
  }, []);

  const handleLogout = () => {
    // Перенаправлення користувача на головну сторінку
    history.push('/main');
    };
  
  const AllTeams = (teams) => {
    setTeams(teams)
  }
  const AllPlayers = (players) => {
    setPlayers(players)
  }
  const AllMatches = (matches) => {
    setMatches(matches)
  }
  

  return (
    <div className='tournament'>
      {loading && <Loader />}
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
          <Standings standingsTeams={ standingsTeams } />
        </Tab>
        <Tab eventKey="statistics" title="Statistics">
          <Statistics top5Scorers={ top5Scorers } top5Asists={top5Asists} teams={teams} players={players} matches={matches} />
        </Tab>
        <Tab eventKey="matches" title="Matches">
          <Matches tournamentId={ tournamentId } teams={teams} players={players} AllMatches={AllMatches} StatisticsGoals={StatisticsGoals} StatisticsAsists={StatisticsAsists} />
        </Tab>
        <Tab eventKey="teams" title="Teams">
          <Teams tournamentId={tournamentId} AllTeams={AllTeams} standings={ standings } />
        </Tab>
        <Tab eventKey="players" title="Players">
          <Players tournamentId={ tournamentId } teams={teams} AllPlayers={AllPlayers} />
        </Tab>
      </Tabs>
    </div>

  );
};


export default Tournament;
