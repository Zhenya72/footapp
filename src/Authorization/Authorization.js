import { useState } from 'react';
import LoginForm from './LoginForm.js';
import SignupForm from './SignupForm.js';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Authorization.css';
function Authorization({OnUser}) {
  // Використовуємо стан для відстеження активної форми
  const [isLoginFormActive, setIsLoginFormActive] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (data) => {
    OnUser(data);
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Redirect to='/main' />;
  }

  // Функція для переключення між формою входу та реєстрації
  const toggleFormSign = () => {
    setIsLoginFormActive(false);
  };
  const toggleFormLog = () => {
    setIsLoginFormActive(true);
  };

  return (
    <div className='Authorization'>
      {isLoggedIn ? (
        <Redirect to='/main' />
      ) : (
          <div className="d-flex align-items-center flex-column pt-3">
            <div className="d-flex justify-content-around mb-3" style={{ width: '300px' }}>
              {/* Кнопки для переходу між формами */}
              <Button variant={isLoginFormActive ? 'primary' : 'secondary'} onClick={toggleFormLog} style={{ width: '45%' }}>Log In</Button>
              <Button variant={!isLoginFormActive ? 'primary' : 'secondary'} onClick={toggleFormSign} style={{ width: '45%' }}>Sign Up</Button>
            </div>

      {/* Відображення відповідної форми залежно від активності */}
      {isLoginFormActive ? (
        <LoginForm OnUser={handleLogin}/>
        ) : (
        <SignupForm OnUser={handleLogin}/>
        
              )}
              
    </div>
      )}
    </div>



  );
}

export default Authorization;
