import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Teams.css'

const ModalEditTeams = ({ modalEditShow, teamId, name, country, yearOfFoundation, coach, handleElitCloseModal, fetchTeams }) => {
  const [editName, setEditName] = useState('');  
  const [editCountry, setEditCountry] = useState('');  
  const [editYearOfFoundation, setEditYearOfFoundation] = useState('');  
  const [editCoach, setEditCoach] = useState('');  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (name) {
      setEditName(name);
    }
    if (country) {
      setEditCountry(country);
    }
    if (yearOfFoundation) {
      setEditYearOfFoundation(yearOfFoundation);
    }
    if (coach) {
      setEditCoach(coach);
    }
  }, [name, country, yearOfFoundation, coach]);


  const editTeams = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:5000/edit-teams/${teamId}`, {'name': editName, 'country': editCountry, 'yearOfFoundation': editYearOfFoundation, 'coach': editCoach});
      fetchTeams();
      handleElitCloseModal();
    } catch (error) {
      console.error('Помилка редагування команди:', error);
    } finally {
      setLoading(false);
    }
  };
    
    
  return (
    <div>
      {loading && <Loader />}
      <Modal show={modalEditShow} onHide={handleElitCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Редагування команди</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3'>
          <Form.Control
              type='text'
              placeholder='Введіть назву команди'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            </Form.Group>
          <Form.Group className='mb-3'>
          <Form.Control
              type='text'
              placeholder='Введіть країну команди'
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
            />
            </Form.Group>
          <Form.Group className='mb-3'>
          <Form.Control
              type='number'
              placeholder='Введіть рік заснування команди'
              value={editYearOfFoundation}
              onChange={(e) => {
                const inputYear = e.target.value;
                if (inputYear.length <= 4) {
                  setEditYearOfFoundation(inputYear);
                }
              }}
            />
            </Form.Group>
          <Form.Group className='mb-3'>
          <Form.Control
              type='text'
              placeholder='Введіть тренера команди'
              value={editCoach}
              onChange={(e) => setEditCoach(e.target.value)}
            />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleElitCloseModal}>Скасувати</Button>
          <Button variant="primary" onClick={editTeams}>Підтвердити редагування</Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};

export default ModalEditTeams;




