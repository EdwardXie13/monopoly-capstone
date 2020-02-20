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
    // die1=1;
    // die2=1;
    // console.log(die1, die2);
  }

  const rollEvent = async (player) => {
    await payJail(player);

    if (player.jail === false) {
      diceRoll();
      if (die1 === die2) {
        if (player.doubles === 2) {
          console.log("Triple Doubles, Go to Jail")
          player.setJail(true);
          player.resetDoubles();
        }
        else {
          player.setDoubles();
          console.log(player.doubles);
          movePlayer(player, die1+die2);
        }
      }
      else {
        player.resetDoubles();
      }
    }
    else if (player.jail === true) {
      diceRoll();
      if (die1 === die2) {
        console.log("freed from jail");
        player.setJail(false);
        player.resetJailroll();
        player.setLocation("Just Visiting", 10);
        movePlayer(player, die1+die2);
      }
      else {
        if (player.jailroll === 2) {
          console.log("failed last doubles attempt, $50 was taken from you");
          player.setMoney(-50);
          player.setJail(false);
          player.resetJailroll();
          player.setLocation("Just Visiting", 10);
          movePlayer(player, die1+die2);
        }
        else {
          player.setJailroll(); 
          console.log("failed doubles roll");
        }
      }
    }
  }

  const payJail = (player) => new Promise(function(resolve, reject) {
    if (player.jail === false)
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
          player.setJail(false);
          player.setMoney(-50);
          player.setLocation("Just Visiting", 10)
          console.log(player.money);
          resolve(true);
        }
        else {
          resolve (false);
        }
      })
    }
  })

  const movePlayer = async (player, roll) => {
    //save state here maybe?
    if (player.index + roll > 39) {
      console.log(player.money,"Pass go collect 200");
      player.setMoney(200);
      console.log(player.money);
    }
    player.setLocation( board[((player.index+roll)%40)].name, ((player.index+roll)%40));
    console.log(player.location);
    if (board[player.index].type !== "Tile" && board[player.index].type !== "Event") {
      await checkOwner(player);
    }
    else {
      if (board[player.index].name === "Community Chest") {
        console.log("Community Chest");
        communityEffect(player);  
      }
      else if (board[player.index].name === "Chance") {
        console.log("Chance");
        chanceEffect(player);
      }
      else if (board[player.index].name === "Income Tax") {
        //if doesn't have 200 trigger selling mode
        console.log("Income Tax");
        player.setMoney(-200);
        console.log(player.money);
      }
      else if (board[player.index].name === "Go To Jail") {
        console.log("Jail");
        player.setJail(true);
      }
      else if (board[player.index].name === "Luxury Tax") {
        //if doesnt have 100 trigger selling mode 
        console.log("Lux Tax");
        player.setMoney(-100);
        console.log(player.money);
      }
    }
  }
  
  const checkOwner = (player) => new Promise(function(resolve, reject) {
    if (board[player.index].owned === false && player.money > board[player.index].price) {
      Swal.fire({
        position: 'center',
        allowOutsideClick: false,
        showCancelButton: true,
        title: "Do you want to buy?",
        text: board[player.index].name + " costs " + board[player.index].price + " dollars",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value === true) {
          player.setMoney(-board[player.index].price);
          board[player.index].owned = true;
          board[player.index].owner = player.name;
          console.log(player.money);
        }
        else {
          //work on bidding after get multiple players
          //if no bidding begins
          console.log("bidding begins");
        }
      })
    }
    else if (board[player.index].owned === true) {
      console.log("pay the dude");
    }
  })

  return [rollEvent];
}

export default useGame;