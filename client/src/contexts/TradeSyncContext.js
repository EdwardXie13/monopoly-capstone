import React, { useState } from 'react';

const TradeSyncContext = React.createContext();

export const TradeSyncProvider = ({ children }) => {
    const [trader, setTrader] = useState([]);
    const [myStuffMoney, setMyStuffMoney] = useState(0);
    const [leftTrades, setLeftTrades] = useState(new Set([]));
    const [rightTrades, setRightTrades] = useState(new Set([]));
    const [rightSelect, setRightSelect] = useState("");
    const [rightValue, setRightValue] = useState(0);
    const [isConfirm, setIsConfirm] = useState(false);
    
    return (
        <TradeSyncContext.Provider value={{ trader, setTrader, myStuffMoney, setMyStuffMoney, leftTrades, setLeftTrades, rightSelect, setRightSelect, rightValue, setRightValue, rightTrades, setRightTrades, isConfirm, setIsConfirm }}>
            { children }
        </TradeSyncContext.Provider>
    );
};

export default TradeSyncContext;