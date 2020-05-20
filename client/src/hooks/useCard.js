import React, { useState } from 'react';

const useCard = (handlePushHistory, history, setHistory) => {
    // const [history, setHistory] = useState(["history1", "history2", "history3", "history4", "history5"]);
    
    const renderHistory = () => history.map( data => <a href="#!" class="collection-item">{data}</a> );
  
    const addToHistory = data => {
      // let newHistory = [data, ...history];
      // if (newHistory.length > 5) newHistory.pop();

      handlePushHistory(data);
      // setHistory(newHistory);
    }

    return [renderHistory, addToHistory];
}

export default useCard;