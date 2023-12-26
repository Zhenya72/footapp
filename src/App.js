import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Authorization from './Authorization/Authorization';
import MainPage from './pages/MainPage'; 

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
      <Router>
        <Switch>
          <Route exact path='/'>
            {!onUser ? <Redirect to='/authorization' /> : <Redirect to="/main" />}
          </Route>
          <Route exact path='/authorization'>
            <Authorization OnUser={handleDataFromGrandchild} />
          </Route>
          <Route path='/main'>
           <MainPage user={onUser} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}


export default App;
