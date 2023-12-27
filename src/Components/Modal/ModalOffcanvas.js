import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersonCircle } from 'react-bootstrap-icons';
import '../../pages/MainPage.css'

function ModalOffcanvas({ user }) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    
      
  const handleLogout = () => {
    // Очистити дані користувача (змінну onUser)
    localStorage.removeItem('user');  
    // Перенаправлення користувача на сторінку авторизації
    history.push('/authorization');
  };
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
      <div className='offcanvas_block'>
      <button onClick={handleShow} className="me-2 offcanvas_button"><PersonCircle className="offcanvas_button__icons" /></button>
      <div className='offcanvas'>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header className="offcanvas_header" closeButton>
            <PersonCircle className="offcanvas_header__icons" size={40} />
          </Offcanvas.Header>
          <Offcanvas.Body className="offcanvas_body">
            <div>
              {user.user &&
                <div className='d-flex justify-content-center flex-column'>
                  <h3>{`${user.user.firstName} ${user.user.lastName}`}</h3>
                  <p className='d-flex justify-content-center'>{user.user.email}</p>
                </div>
              }
            </div>
            <Button onClick={handleLogout}>Вихід</Button>
          </Offcanvas.Body>
        </Offcanvas>
    </div>     
    </div>
  );
}

export default ModalOffcanvas;
