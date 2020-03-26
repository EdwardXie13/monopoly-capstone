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
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = React.useState(null);
    const [myStuff, setMyStuff] = React.useState({ money: 0, properties: new Set([]) });
    const [theirStuff, setTheirStuff] = React.useState({ money: 0, properties: new Set([]) });
    
    return (
        <TradeSyncContext.Provider value={{ theirStuff, setTheirStuff, myStuff, setMyStuff, selected, setSelected, modalIsOpen, setIsOpen, trader, setTrader, myStuffMoney, setMyStuffMoney, leftTrades, setLeftTrades, rightSelect, setRightSelect, rightValue, setRightValue, rightTrades, setRightTrades, isConfirm, setIsConfirm }}>
            { children }
        </TradeSyncContext.Provider>
    );
};

export default TradeSyncContext;