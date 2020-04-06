import { useEffect, useContext } from 'react';

import backend from '../apis/backend';
import AuthContext from '../contexts/AuthContext';

const useApp = () => {
  const { setIsAuth } = useContext(AuthContext);

  useEffect(() => {
    // When app is launch check if client has valid cookie to access backend.
    backend.get('/room/')
      .then(() => { setIsAuth(true);})
      .catch(() => setIsAuth(false));
  }, []);
}

export default useApp;