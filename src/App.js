import { useState, useEffect } from 'react';
import Routes from './Routes';

function App() {
  const [onUser, setOnUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setOnUser(JSON.parse(userData));
    }
  }, []);

  const handleDataFromGrandchild = (data) => {
    // Обробка даних, отриманих від внукового компонента
    setOnUser(data)
    localStorage.setItem('user', JSON.stringify(data));
  };
  
  return (
    <div className='App'>
      <Routes onUser={onUser} handleDataFromGrandchild={ handleDataFromGrandchild } />

    </div>
  );
}


export default App;
