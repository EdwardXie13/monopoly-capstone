import React from 'react';

import useGame from '../hooks/useGame';
import Trading from '../components/Trading';
import cards from '../library/cards/Title_Deeds_Cards';

const GamePage = () => {
  //const [Player, rollEvent, trade, endturn] = useGame();
  const[rollEvent, checkOwner] = useGame();

  //get list of players 

  return(
    <div>
      <button onClick={rollEvent}> Roll </button>
      <Trading cards={cards} width={"400px"} flexDirection={"row"} />
      {/* <button onClick={trade}> Trade </button> */}
      {/* <button onClick={endTurn}> End Turn </button> */}
    </div>
  )
}
export default GamePage;