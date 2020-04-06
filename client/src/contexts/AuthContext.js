import React, { useState } from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);
    
    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            { children }
        </AuthContext.Provider>
    );
};

export default AuthContext;