import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext';

const ProtectedRoute = props => {
  const { isAuth } = useContext(AuthContext);

  const renderRoute = () => {
    if (isAuth === null) return null;
    else if (isAuth === false) return <Redirect to="signin" />;
    else return <Route {...props} />
  }

  return renderRoute();
}

export default ProtectedRoute;