import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext';

const useLanding = () => {
    const { isAuth } = useContext(AuthContext);

    const renderAuthButtons = () => {
        return !isAuth? (
            <div>
                <Link to="/signin" className="btn-large" style={{margin: "50px 50px 50px 50px"}}>Sign In</Link>
                <Link to="/signup" className="btn-large">Sign Up</Link>
                <Link to="/lobby" className="btn-large" style={{margin: "50px 50px 50px 50px"}}>Lobby</Link>
            </div>
        ) : (
            <div>
                <Link to="/signout" className="btn">Sign Out</Link>
            </div>
        );
    }

    return [renderAuthButtons];
}

export default useLanding;