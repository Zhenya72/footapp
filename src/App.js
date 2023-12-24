import { useState } from 'react';
import Authorization from './Authorization/Authorization';
import MainPage from './pages/MainPage'; // Підключи компонент головної сторінки
import './App.css';

function App() {
  const handleDataFromGrandchild = (data) => {
    // Обробка даних, отриманих від внукового компонента
    setOnUser(data)
  };
  
  const [onUser, setOnUser] = useState(null);
  
  return (
    <div className='App'>
      {onUser ? <MainPage user={onUser} /> : <Authorization OnUser={handleDataFromGrandchild} />}
    </div>
  );
}

export default App;
