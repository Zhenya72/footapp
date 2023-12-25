import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/main" component={MainPage} />
      </Switch>
    </Router>
  );
}

export default Routes;
