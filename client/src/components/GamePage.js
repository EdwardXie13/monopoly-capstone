import React from 'react';
import Swal from "sweetalert2";

import Tiles from '../assets/cards/Title_Deeds_Cards';
import board from '../assets/cards/Title_Deeds_Cards';

//import titleDeeds from '../assets/cards/Title_Deeds_Cards';
//import communityChest from '../library/cards/Community_Chest_Cards';
//import chance from '../library/cards/Chance_Cards';

// create a class tile and useState
const GamePage = () => {

  class Tile {
    constructor(name, owned, price) {
      this.name = name;
      this.owned = owned;
      this.price = price;
    }
    ownership(owned) {
      this.owned = owned;
    }
  }

  class Player {
    constructor(name, location, index) {
      this.name = name;
      this.location = location;
      this.index = index;
      this.money = 1500;
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
  }
    
  // let p1 = new Player("1", "Go", 0);
  let p1 = new Player("1", "Boardwalk", 39);
  
  var die1;
  var die2;
  const diceRoll= () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    // console.log(die1+die2);
    movePlayer(die1 + die2);
  }

  const movePlayer= (roll) => {
    p1.setLocation( board[((p1.index+roll)%40)].name, ((p1.index+roll)%40));
    console.log(p1.location);
    checkOwner(p1.index);
  }
  
  //change this because of new class
  const checkOwner= (index) => {
    if (board[index].owned !=null && p1.money > board[index].price) {
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
          p1.setMoney(0-board[index].price);
          board[index].owned = true;
          console.log(p1.money);
        }
        else {
          //if no bidding begins
          console.log("bidding begins");
        }
      })
    }
    else if (board[index].owned == true) {
      
    }
  }
  return (
    <button onClick={diceRoll}> Roll </button>
  )
}
export default GamePage;