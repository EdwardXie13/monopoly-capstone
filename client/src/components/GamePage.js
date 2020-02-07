import React from 'react';

import useGame from '../hooks/useGame';

const GamePage = () => {
  //const [Player, rollEvent, trade, endturn] = useGame();
  const[rollEvent] = useGame();

  //get list of players 

  return(
    <div>
      <button onClick={rollEvent}> Roll </button>
      {/* <button onClick={trade}> Trade </button> */}
      {/* <button onClick={endTurn}> End Turn </button> */}
    </div>
  )
}
export default GamePage;