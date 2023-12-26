import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Offcanvas, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersonCircle, TrashFill, Pencil } from 'react-bootstrap-icons';
import './MainPage.css'
import YourComponent from './YourComponent';

function MainPage(props) {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const [tournaments, setTournaments] = useState([]);  // Стейт для збереження турнірів
  const [newTournamentName, setNewTournamentName] = useState('');  // Стейт для збереження назви нового турніру
  
  const handleLogout = () => {
    // Очистити дані користувача (змінну onUser)
    localStorage.removeItem('user');  
    // Перенаправлення користувача на сторінку авторизації
    history.push('/authorization');
  };
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleModalAddClose = () => {
    setModalAddShow(false);
    setNewTournamentName('');
  } 
  const handleModalAddShow = () => {
    setModalAddShow(true);
    setNewTournamentName('');
  } 

  const fetchUserTournaments = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/user-tournaments', { email: props.user.email });
      setTournaments(response.data.userTournaments);
    } catch (error) {
      console.error('Помилка отримання турнірів:', error);
    }
  };


  const addTournament = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/add-tournament', { email: props.user.email, tournament_name: newTournamentName });
      fetchUserTournaments();
      handleModalAddClose();
    } catch (error) {
      console.error('Помилка додавання турніру:', error);
    }
  };








  useEffect(() => {
    if (props.user) {
      fetchUserTournaments();
    }
  }, [props.user]);
  

  
  return (
    <div className='main'>
        <button onClick={handleShow} className="me-2 offcanvas_button"><PersonCircle className="offcanvas_button__icons" /></button>
      <div className='offcanvas'>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header className="offcanvas_header" closeButton>
            <PersonCircle className="offcanvas_header__icons" size={40} />
          </Offcanvas.Header>
          <Offcanvas.Body className="offcanvas_body">
            <div>
              {props.user &&
                <div className='d-flex justify-content-center flex-column'>
                  <h3>{`${props.user.firstName} ${props.user.lastName}`}</h3>
                  <p className='d-flex justify-content-center'>{props.user.email}</p>
                </div>
              }
            </div>
            <Button onClick={handleLogout}>Вихід</Button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>


      <h1>Твої чемпіонати</h1>

      <div className='chempionats'>
          <Button onClick={handleModalAddShow} className="me-2 chempionats_add_button">Додати чемпіонат</Button>
        {/* Модальне вікно для додавання турніру */}
        <div>
          <Modal show={modalAddShow} onHide={handleModalAddClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати турнір</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder='Введіть назву турніру'
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalAddClose}>
                Закрити
              </Button>
              <Button variant="primary" onClick={addTournament}>
                Додати
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        
        {/* <div className='tournaments-grid'>
          {tournaments && tournaments.length > 0 ? (
            tournaments.map((tournament, index) => (
              <div key={index} className="tournament-card p-2">
                <h5 className='title'>{tournament.tournamentName}</h5> 
                <p>{new Date(tournament.implementationDate).toLocaleDateString()}</p>
                <div className="options-menu">
                  <Button className='options-btn' ><Pencil style={{ color: 'black' }} /></Button>
                  <Button className='options-btn' onClick={(e) => handleDeleteTournament(e, tournament.id)}><TrashFill style={{ color: 'black' }} /></Button>
                </div>
              </div>
            ))
          ) : (
            <p>No tournaments available</p>
          )}
        </div>
        */}
        <YourComponent  tournaments={ tournaments } />

        
        
        {/* <div className='tournaments-grid'>
  {tournaments && tournaments.length > 0 ? (
    tournaments.map((tournament, index) => (
      <div key={index} className="tournament-card" onClick={() => handleTournamentClick(tournament.id)}>
        <p>{tournament.tournamentName}</p>
        <p>{tournament.implementationDate}</p>
        <div className="options-menu">
          <button onClick={(e) => handleEditTournament(e, tournament.id)}>Редагувати турнір</button>
          <button onClick={(e) => handleDeleteTournament(e, tournament.id)}>Видалити</button>
        </div>
      </div>
    ))
  ) : (
    <p>No tournaments available</p>
  )}
</div> */}



      </div>
        
        
    </div>
  );
}

export default MainPage;
