import React, { useState } from 'react';

const ReactDiceContext = React.createContext();

export const ReactDiceProvider = ({ children }) => {
    const [reactDice, setReactDice] = useState(null);
    
    return (
        <ReactDiceContext.Provider value={{ reactDice, setReactDice }}>
            { children }
        </ReactDiceContext.Provider>
    );
};

export default ReactDiceContext;