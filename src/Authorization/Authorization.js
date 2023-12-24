import { useState } from 'react';
import LoginForm from './LoginForm.js';
import SignupForm from './SignupForm.js';

function Authorization({OnUser}) {
  // Використовуємо стан для відстеження активної форми
  const [isLoginFormActive, setIsLoginFormActive] = useState(true);

  // Функція для переключення між формою входу та реєстрації
  const toggleFormSign = () => {
    setIsLoginFormActive(false);
  };
  const toggleFormLog = () => {
    setIsLoginFormActive(true);
  };

  return (
    <div>
      {/* Кнопки для переходу між формами */}
      <button onClick={toggleFormLog}>Log In</button>
      <button onClick={toggleFormSign}>Sign Up</button>

      {/* Відображення відповідної форми залежно від активності */}
      {isLoginFormActive ? (
        <LoginForm OnUser={OnUser}/>
        ) : (
        <SignupForm OnUser={OnUser}/>
        
      )}
    </div>
  );
}

export default Authorization;
