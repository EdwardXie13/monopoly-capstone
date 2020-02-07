import Swal from 'sweetalert2';

import board from '../library/board/board.js';
import useEffects from '../hooks/useEffects';

const useGame = () => {
  const [communityEffect, chanceEffect] = useEffects();
  var die1, die2;

  class Player {
    constructor(name, location, index) {
      this.name = name;
      this.location = location;
      this.index = index;
      this.money = 1500;
      this.jail = false;
      this.jailroll = 0;
      this.doubles = 0;
      this.cc_JailCard = false;
      this.c_JailCard = false;
      this.bidding = true;
    }
    setLocation(location, index) {
      this.location = location;
      this.index = index;
    }
    setMoney(amount){
      this.money += amount;
    }
    setJail(status) {
      this.jail = status;
    }
    setJailroll() {
      this.jailroll++;
    }
    resetJailroll() {
      this.jailroll = 0;
    }
    setDoubles() {
      this.doubles++;
    }
    resetDoubles() {
      this.doubles = 0;
    }
  }
  
  let p1 = new Player("Player 1", "Go", 0);
  p1.setLocation("test", 29);
  p1.setJail(false);
  //insert player table here

  const diceRoll = () => {
    //die1 = Math.floor(Math.random() * 6) + 1;
    //die2 = Math.floor(Math.random() * 6) + 1;
    die1=1;
    die2=0;
  }

  const rollEvent = () => {
    //payJail
    if (p1.jail === false) {
      diceRoll();
      movePlayer(die1+die2);
    }
    else if (p1.jail === true) {
      diceRoll();
      if (die1 === die2) {
        console.log("freed from jail");
        p1.setJail(false);
        p1.resetJailroll();
        movePlayer(die1+die2);
      }
      else {
        if (p1.jailroll === 2) {
          console.log("failed last doubles attempt, $50 was taken from you");
          p1.setMoney(-50);
          p1.setJail(false);
          p1.resetJailroll();
          p1.setLocation("Just Visiting", 10);
          movePlayer(die1+die2);
        }
        else {
          p1.setJailroll(); 
          console.log("failed doubles roll");
        }
      }
    }
  }

  const payJail = () => {
    if (p1.jail === false)
      return false;
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
          return true;
        }
        else {
          return false;
        }
      })
    }
  }

  const movePlayer = (roll) => {
    //save state here maybe?
    p1.setLocation( board[((p1.index+roll)%40)].name, ((p1.index+roll)%40));
    console.log(p1.location);
    if (board[p1.index].type !== "Tile" && board[p1.index].type !== "Event");
      //checkOwner(p1.index);
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

  const checkOwner = (index) => {
    if (board[index].owned === false && p1.money > board[index].price) {
      Swal.fire({
        position: 'center',
        allowOutsideClick: false,
        showCancelButton: true,
        title: "Do you want to buy?",
        text: board[index].name + " costs " + board[index].price + " dollars",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value === true) {
          p1.setMoney(-board[index].price);
          board[index].owned = true;
          board[index].owner = p1.name;
          console.log(p1.money);
        }
        else {
          //work on bidding after get multiple players
          //if no bidding begins
          console.log("bidding begins");
        }
      })
    }
    else if (board[index].owned === true) {
      //pay the dude
    }
  }
  //return [Player, rollEvent]//, trade, endturn];
  return [rollEvent];
}

export default useGame;