import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader';
import ErrorModal from '../ErrorModal';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../pages/Pages.css'

const ModalEditTeams = ({ modalEditShow, teamId, name, country, yearOfFoundation, coach, handleElitCloseModal, fetchTeams }) => {
  const [editName, setEditName] = useState('');  
  const [editCountry, setEditCountry] = useState('');  
  const [editYearOfFoundation, setEditYearOfFoundation] = useState('');  
  const [editCoach, setEditCoach] = useState('');  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError('Error editing a command:', error);
      console.error('Error editing a command:', error);
    } finally {
      setLoading(false);
    }
  };
    
  const closeErrorModal = () => {
    setError(null);
  };
    
  return (
    <div>
      {loading && <Loader />}
      {error && <ErrorModal error={error} onClose={closeErrorModal} />}
      <Modal show={modalEditShow} onHide={handleElitCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a command</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3'>
          <Form.Control
              type='text'
              placeholder='Enter the name of the command'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            </Form.Group>
          <Form.Group className='mb-3'>
          <Form.Control
              type='text'
              placeholder='Enter the country of the team'
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
            />
            </Form.Group>
          <Form.Group className='mb-3'>
          <Form.Control
              type='number'
              placeholder='Enter the year the team was founded'
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
              placeholder='Enter the team coach'
              value={editCoach}
              onChange={(e) => setEditCoach(e.target.value)}
            />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleElitCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={editTeams}>Confirm the edit</Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};

export default ModalEditTeams;




