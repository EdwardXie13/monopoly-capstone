import React, { useState } from 'react';

const RoomContext = React.createContext();

export const RoomProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [code, setCode] = useState('');
    
    return (
        <RoomContext.Provider value={{ players, setPlayers, code, setCode }}>
            { children }
        </RoomContext.Provider>
    );
};

export default RoomContext;