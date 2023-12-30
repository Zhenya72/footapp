import { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import { PlusCircle } from 'react-bootstrap-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalAddTeams = ({ tournamentId, fetchTeams }) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [name, setName] = useState('');  
  const [country, setCountry] = useState('');  
  const [yearOfFoundation, setyearOfFoundation] = useState('');  
  const [coach, setCoach] = useState('');  
  const [loading, setLoading] = useState(false);
  
  const handleModalAddClose = () => {
    setModalAddShow(false);
    setName('');
    setCountry('');
    setyearOfFoundation('');
    setCoach('');
  } 
  const handleModalAddShow = () => {
    setModalAddShow(true);
    setName('');
    setCountry('');
    setyearOfFoundation('');
    setCoach('');
  } 


  const addTeams = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://127.0.0.1:5000/add-teams`, {'tournamentId': tournamentId, 'name': name, 'country': country, 'yearOfFoundation': yearOfFoundation, 'coach': coach, 'games': 0, 'victories': 0, 'nobodys': 0, 'defeats': 0, 'goalsScored': 0, 'missedBalls': 0, 'goalDifference': 0, 'points': 0});
      fetchTeams();
      handleModalAddClose();
    } catch (error) {
      console.error('Помилка додавання команди:', error);
    } finally {
      setLoading(false);
    }
  };
    
    
  return (
    <div>
      {loading && <Loader/>}
          <Button onClick={handleModalAddShow} className="me-2 add_button"><PlusCircle className="add_button__icons"/></Button>
        {/* Модальне вікно для додавання команди */}
        <div>
          <Modal show={modalAddShow} onHide={handleModalAddClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати команду</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder='Введіть назву команди'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Control
                  type='text'
                  placeholder='Введіть країну команди'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Control
                type='number'
                placeholder='Введіть рік заснування команди'
                value={yearOfFoundation}
                onChange={(e) => {
                  const inputYear = e.target.value;
                  if (inputYear.length <= 4) {
                    setyearOfFoundation(inputYear);
                  }
                }}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
              <Form.Control
                  type='text'
                  placeholder='Введіть тренера команди'
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalAddClose}>
                Закрити
              </Button>
              <Button variant="primary" onClick={addTeams}>
                Додати
              </Button>
            </Modal.Footer>
        </Modal>
      </div>
          </div>
  );
};

export default ModalAddTeams;




