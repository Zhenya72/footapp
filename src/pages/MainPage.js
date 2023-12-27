import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'
import ModalDeleteAndEditTournaments from '../Components/Modal/ModalDeleteAndEditTournaments';
import ModalAddTournaments from '../Components/Modal/ModalAddTournaments';
import ModalOffcanvas from '../Components/Modal/ModalOffcanvas';

function MainPage(props) {
  const [tournaments, setTournaments] = useState([]);  // Стейт для збереження турнірів
  const [loading, setLoading] = useState(false);
  
  const fetchUserTournaments = async () => {
    setLoading(true);
    try {
      if (props.user) {
        const response = await axios.post('http://127.0.0.1:5000/user-tournaments', { email: props.user.email });
        setTournaments(response.data.userTournaments);
      }
    } catch (error) {
      console.error('Помилка отримання турнірів:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.user) {
      fetchUserTournaments();
    }
  }, [props.user]);
  

  
  return (
    <div className='main'>
      {loading && <Loader/>}
      <ModalOffcanvas user={props} />
      
      <h1>Твої чемпіонати</h1>

      {props.user && (
        <ModalAddTournaments email={props.user.email} fetchUserTournaments={fetchUserTournaments} />
      )}
      {props.user && (
        <ModalDeleteAndEditTournaments tournaments={tournaments} fetchUserTournaments={fetchUserTournaments} />
      )}

    </div>
  );
}

export default MainPage;
