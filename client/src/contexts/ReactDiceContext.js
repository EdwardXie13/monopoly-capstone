import React, { useState } from 'react';

const ReactDiceContext = React.createContext();

export const ReactDiceProvider = ({ children }) => {
    const [reactDice, setReactDice] = useState(null);
    const [isRolled, setIsRolled] = useState(false);
    const [double, setDouble] = useState(0);
    
    return (
        <ReactDiceContext.Provider value={{ reactDice, setReactDice, isRolled, setIsRolled, double, setDouble }}>
            { children }
        </ReactDiceContext.Provider>
    );
};

export default ReactDiceContext;