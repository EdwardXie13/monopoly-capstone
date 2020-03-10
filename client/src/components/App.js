import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import history from '../utilities/history';
import { AuthProvider } from '../contexts/AuthContext';
import { RoomProvider } from '../contexts/RoomContext';
// import { LobbyProvider } from '../contexts/LobbyContext';
// import { PubNubProvider } from '../hooks/usePubNub';
import LandingPage from './LandingPage';
import SignupPage from './SignupPage';
import SigninPage from './SigninPage';
import SignoutPage from './SignoutPage';
import LobbyPage from './LobbyPage';
import GamePage from './GamePage';
import RoomPage from './RoomPage';

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/signout" component={SignoutPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/signin" component={SigninPage} /> 
        <Route path="/lobby" component={LobbyPage} />
        <Route path="/game" component={GamePage} />
        <Route path="/room" component={RoomPage} />
        <Route path="/" component={LandingPage} />
      </Switch>
    </Router>
  );
};

export default () => (
  <AuthProvider>
    <RoomProvider>
      <App />
    </RoomProvider>
  </AuthProvider>
);