import React from 'react';
import { Link } from 'react-router-dom';

import backend from '../apis/backend';
import AuthContext from '../contexts/AuthContext';

const SignoutPage = () => {
    const { setIsAuth } = React.useContext(AuthContext);
    React.useEffect(() => {
        backend.post('/auth/signout')
        .then(() => {
            setIsAuth(false);
        })
        .catch(() => console.log('Failed to signout teehee OwO.'));
    }, []);

    return (
        <div>
            <p>Lata Beeeetchhhhh</p>
            <Link to="/" className="btn">GTFO</Link>
        </div>
    );
};

export default SignoutPage;