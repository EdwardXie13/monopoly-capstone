import React from 'react';

import useLanding from '../hooks/useLanding';

const LandingPage = () => {
    const [renderAuthButtons] = useLanding();
    
    return (
        <div>
            { renderAuthButtons() }
        </div>
    );
};

export default LandingPage;