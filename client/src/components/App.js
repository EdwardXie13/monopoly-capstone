import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import history from '../utilities/history';
import { AuthProvider } from '../contexts/AuthContext';
import { RoomProvider } from '../contexts/RoomContext';
import { ReactDiceProvider } from '../contexts/ReactDiceContext';
import { TradeSyncProvider } from '../contexts/TradeSyncContext';
import { BiddingProvider } from '../contexts/BiddingContext';
import { SellingProvider } from '../contexts/SellingContext';
// import { LobbyProvider } from '../contexts/LobbyContext';
// import { PubNubProvider } from '../hooks/usePubNub';
import LandingPage from './LandingPage';
import SignupPage from './SignupPage';
import SigninPage from './SigninPage';
import SignoutPage from './SignoutPage';
import LobbyPage from './LobbyPage';
import GamePage from './GamePage';
import RoomPage from './RoomPage';
import useApp from '../hooks/useApp';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  useApp();

  return (
    <Router history={history}>
      <Switch>
        <Route path="/signout" component={SignoutPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/signin" component={SigninPage} />
        <ProtectedRoute path="/lobby" component={LobbyPage} />
        <ProtectedRoute path="/game" component={GamePage} />
        <ProtectedRoute path="/room" component={RoomPage} />
        <Route path="/" component={LandingPage} />
      </Switch>
    </Router>
  );
};

export default () => (
  <SellingProvider>
    <BiddingProvider>
      <TradeSyncProvider>
        <ReactDiceProvider>
          <AuthProvider>
            <RoomProvider>
              <App />
            </RoomProvider>
          </AuthProvider>
        </ReactDiceProvider>
      </TradeSyncProvider>
    </BiddingProvider>
  </SellingProvider>
);
