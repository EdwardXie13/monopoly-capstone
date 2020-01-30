import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext';

const useLanding = () => {
    const { isAuth } = useContext(AuthContext);

    const renderAuthButtons = () => {
        return !isAuth? (
            <div>
                <Link to="/signup" className="btn">Sign Up</Link>
                <Link to="/signin" className="btn">Sign In</Link>
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