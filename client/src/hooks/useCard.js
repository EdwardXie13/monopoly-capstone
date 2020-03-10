import React, { useState } from 'react';

const useCard = () => {
    const [history, setHistory] = useState(["history1", "history2", "history3", "history4", "history5"]);
    
    const renderHistory = () => history.map( data => <a href="#!" class="collection-item"><span class="new badge"></span>{data}</a> );
  
    const addToHistory = data => {
      let newHistory = [data, ...history];
      if (newHistory.length > 5) newHistory.pop();

      setHistory(newHistory);
    }

    return [history, renderHistory, addToHistory];
}

export default useCard;