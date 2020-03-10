import React from 'react';

import useGame from '../hooks/useGame';
import Trading from '../components/Trading';
import cards from '../library/cards/Title_Deeds_Cards';

const GamePage = () => {
  //const [Player, rollEvent, trade, endturn] = useGame();
  const[rollEvent] = useGame();

  //get list of players 

  var tID; //we will use this variable to clear the setInterval()
  
  function stopAnimate() {
    clearInterval(tID);
  } //end of stopAnimate()

  function animateScript(height) {
    var    position = 0; 
    const  interval = 150; 
    const  diff = 128; 
    tID = setInterval ( () => {
      document.getElementById("image").style.backgroundPosition = `-${position}px -${height}px`; 
      
      if (position < 128) { 
        position = position + diff;
      }
      else { 
        position = 0; 
    }
  }
  , interval );
}

  return(
    <div id="demo">
      <p id="image" onMouseEnter={() => animateScript(96) }  onMouseLeave={() => stopAnimate() } > </p>
  </div>
  )
}
export default GamePage;