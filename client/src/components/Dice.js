import React, { useState, useLayoutEffect, useContext } from 'react';
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import ReactDiceContext from '../contexts/ReactDiceContext';
// import {useWindowSize} from './LobbyPage.js'

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
      window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const Dice = () => {
  const { setReactDice } = useContext(ReactDiceContext);

  const rollDoneCallback = (num) => {
    console.log(`You rolled a ${num}`)
  }

  // const rollAll = () => {
  //   reactDice.rollAll();
  // }

  return (
    <div>
      <ReactDice
        numDice={2}
        rollDone={rollDoneCallback}
        ref={dice => setReactDice(dice)}
        faceColor="White"
        dieSize= {window.innerHeight/10}
        dotColor="black"
        rollTime="1.35"
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