import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Table, Button } from 'react-bootstrap';
import { TrashFill, Pencil } from 'react-bootstrap-icons';
import ModalAddMatch from '../Components/Modal/ModalAddMatch';
// import ModalDeleteMatch from '../Components/Modal/ModalDeletePlayers'
// import ModalEditMatch from '../Components/Modal/ModalEditPlayers'
import './Pages.css'

const Matches = ({ tournamentId, teams, players }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className='cont'>
      {loading && <Loader />}
      <ModalAddMatch teams={teams} players={players} />
      {/* <ModalAddMatch teams={teams} fetchPlayers={fetchPlayers} /> */}

      
      
      
    </div>



  );
};


export default Matches;