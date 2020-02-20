import Swal from 'sweetalert2';

import board from '../library/board/board.js';
import useEffects from '../hooks/useEffects';

const useGame = () => {
  const [communityEffect, chanceEffect] = useEffects();
  var die1, die2;
  
  const diceRoll = () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    console.log(die1, die2);
    //die1=1;
    //die2=0;
  }

  const rollEvent = async (p1) => {
    await payJail(p1);

    if (p1.jail === false) {
      diceRoll();
      movePlayer(p1, die1+die2);
    }
    else if (p1.jail === true) {
      diceRoll();
      if (die1 === die2) {
        console.log("freed from jail");
        p1.setJail(false);
        p1.resetJailroll();
        p1.setLocation("Just Visiting", 10);
        movePlayer(p1, die1+die2);
      }
      else {
        if (p1.jailroll === 2) {
          console.log("failed last doubles attempt, $50 was taken from you");
          p1.setMoney(-50);
          p1.setJail(false);
          p1.resetJailroll();
          p1.setLocation("Just Visiting", 10);
          movePlayer(p1, die1+die2);
        }
        else {
          p1.setJailroll(); 
          console.log("failed doubles roll");
        }
      }
    }
  }

  const payJail = (p1) => new Promise(function(resolve, reject) {
    if (p1.jail === false)
      resolve (false);
    else { 
      Swal.fire({
        position: 'center',
        allowOutsideClick: false,
        showCancelButton: true,
        title: "Do you want to pay $50 to get out of jail?",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value === true) {
          p1.setJail(false);
          p1.setMoney(-50);
          p1.setLocation("Just Visiting", 10)
          console.log(p1.money);
          resolve(true);
        }
        else {
          resolve (false);
        }
      })
    }
  })

  const movePlayer = async (p1, roll) => {
    //save state here maybe?
    p1.setLocation( board[((p1.index+roll)%40)].name, ((p1.index+roll)%40));
    console.log(p1.location);
    if (board[p1.index].type !== "Tile" && board[p1.index].type !== "Event") {
      await checkOwner(p1);
    }
    else {
      if (board[p1.index].name === "Community Chest") {
        console.log("CC");
        communityEffect(p1);  
      }
      else if (board[p1.index].name === "Chance") {
        console.log("C");
        chanceEffect(p1);
      }
      else if (board[p1.index].name === "Income Tax") {
        //if doesn't have 200 trigger selling mode
        console.log("Income Tax");
        p1.setMoney(-200);
        console.log(p1.money);
      }
      else if (board[p1.index].name === "Go To Jail") {
        console.log("Jail");
        p1.setJail(true);
      }
      else if (board[p1.index].name === "Luxury Tax") {
        //if doesnt have 100 trigger selling mode 
        console.log("Lux Tax");
        p1.setMoney(-100);
        console.log(p1.money);
      }
    }
  }
  
  const checkOwner = (p1) => new Promise(function(resolve, reject) {
    if (board[p1.index].owned === false && p1.money > board[p1.index].price) {
      Swal.fire({
        position: 'center',
        allowOutsideClick: false,
        showCancelButton: true,
        title: "Do you want to buy?",
        text: board[p1.index].name + " costs " + board[p1.index].price + " dollars",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value === true) {
          p1.setMoney(-board[p1.index].price);
          board[p1.index].owned = true;
          board[p1.index].owner = p1.name;
          console.log(p1.money);
        }
        else {
          //work on bidding after get multiple players
          //if no bidding begins
          console.log("bidding begins");
        }
      })
    }
    else if (board[p1.index].owned === true) {
      console.log("pay the dude");
    }
  })

  //return [Player, rollEvent]//, trade, endturn];
  return [rollEvent];
}

export default useGame;