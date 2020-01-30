import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import history from '../utilities/history';
import { AuthProvider } from '../contexts/AuthContext';
import LandingPage from './LandingPage';
import SignupPage from './SignupPage';

const App = () => {
    fetch('/api/signup');

    return (
        <Router history={history}>
            <Switch>
                <Route path="/signup" component={SignupPage} />
                <Route path="/" component={LandingPage} />
            </Switch>
        </Router>
    );
};

export default () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);