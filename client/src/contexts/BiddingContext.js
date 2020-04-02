import React, { useState } from 'react';

const BiddingContext = React.createContext();

export const BiddingProvider = ({ children }) => {
    const [openBid, setOpenBid] = useState(false);
    const [name, setName] = useState('');
    
    return (
        <BiddingContext.Provider value={{ openBid, setOpenBid, name, setName }}>
            { children }
        </BiddingContext.Provider>
    );
};

export default BiddingContext;