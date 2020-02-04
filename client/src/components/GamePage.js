import React from 'react';
import Swal from "sweetalert2";

import board from '../library/board/board.js';
import communityChest from '../library/cards/Community_Chest_Cards';
import chance from '../library/cards/Chance_Cards';

const GamePage = () => {
  class Player {
    constructor(name, location, index) {
      this.name = name;
      this.location = location;
      this.index = index;
      this.money = 0;
      this.jail = false;
      this.jailroll = 0;
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
  }
    
  let p1 = new Player("Player 1", "Go", 0);

  const diceRoll = () => {
    var die1 = Math.floor(Math.random() * 6) + 1;
    var die2 = Math.floor(Math.random() * 6) + 1;
    // console.log(die1+die2);
    movePlayer(die1 + die2);
  }

  const movePlayer = (roll) => {
    //save state here maybe?
    p1.setLocation( board[((p1.index+roll)%40)].name, ((p1.index+roll)%40));
    if (board[p1.index].type != "Tile" && board[p1.index].type != "Event")
      checkOwner(p1.index);
    else {
      if (board[p1.index].name === "Community Chest") {
        //Community Chest component
        console.log("CC");
      }
      else if (board[p1.index].name === "Chance") {
        //Chance component
        console.log("C");
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
  
  //change this because of new class
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
          //if no bidding begins
          console.log("bidding begins");
        }
      })
    }
    else if (board[index].owned === true) {
      //pay the dude
    }
  }
  return (
    <button onClick={diceRoll}> Roll </button>
  )
}
export default GamePage;