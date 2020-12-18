import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './styles/App.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import FollowingPage from './pages/FollowingPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router >
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path="/onlysocks" exact>
          <MainPage />
        </Route>
         <Route path="/onlysocks/following" exact>
            <FollowingPage />
         </Route>
        <Route path="/onlysocks/profile" exact>
            <ProfilePage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}

export default App;