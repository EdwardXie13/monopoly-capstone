import React, { useState } from 'react';

const SellingContext = React.createContext();

export const SellingProvider = ({ children }) => {
    const [openBuild, setOpenBuild] = useState(false);
    const [showManage, setShowManage] = useState(false);
    const [rent, setRent] = useState(0);
    const [resolvePayment, setResolvePayment] = useState(null);

    return (
        <SellingContext.Provider value={{ showManage, setShowManage, openBuild, setOpenBuild, rent, setRent, resolvePayment, setResolvePayment }}>
            { children }
        </SellingContext.Provider>
    );
};

export default SellingContext;