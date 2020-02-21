import React, { useState } from 'react';

const useCard = () => {
    const [history, setHistory] = useState(["Alan ate your knight", "Alan 5 steps to jail", "Alan", "Alan", "Alan"]);
    
    const renderHistory = () => history.map( data => <a href="#!" class="collection-item"><span class="new badge"></span>{data}</a> );
  
    const addToHistory = data => {
      let newHistory = [data, ...history];
      if (newHistory.length > 5) newHistory.pop();

      setHistory(newHistory);
    }

    return [history, renderHistory, addToHistory];
}

export default useCard;