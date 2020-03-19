import React, { useState, useLayoutEffect, useContext } from 'react';
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import ReactDiceContext from '../contexts/ReactDiceContext';

const Dice = ({ rollEvent }) => {
  const { setReactDice } = useContext(ReactDiceContext);

  const rollDoneCallback = (num) => {
    console.log(rollEvent);
    // console.log(`You rolled a ${num}`)
  }

  return (
    <div>
      <ReactDice
        numDice={2}
        rollDone={rollDoneCallback}
        ref={dice => setReactDice(dice)}
        faceColor="White"
        dieSize= {window.innerHeight/10}
        dotColor="black"
        rollTime=".5"
        margin="30"
        outline="true"
        outlineColor="black"
      />
    </div>
  )
}



// class Dice extends React.Component {
//   render() {
//     return (
//       <div>
//         <ReactDice
//           numDice={2}
//           rollDone={this.rollDoneCallback}
//           ref={dice => this.reactDice = dice}
//           faceColor="White"
//           dieSize= {window.innerHeight/10}
//           dotColor="black"
//           rollTime="1.35"
//           margin="30"
//           outline="true"
//           outlineColor="black"
//         />
//       </div>
//     )
//   }

//   rollAll() {
//     this.reactDice.rollAll()
//   }

//   rollDoneCallback(num) {
//     console.log(`You rolled a ${num}`)
//   }
// }

export default Dice;