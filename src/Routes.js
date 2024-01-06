import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Authorization from './Authorization/Authorization';
import MainPage from './pages/MainPage'; 
import Tournament from './pages/Tournament'
function Routes({onUser, handleDataFromGrandchild}) {
  return (
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
          <Route path='/tournament/:tournamentName/:tournamentId'>
           <Tournament />
          </Route>
        </Switch>
      </Router>
  );
}

export default Routes;