import Swal from 'sweetalert2';

import board from '../library/board/board.js';
import communityChest from '../library/cards/Community_Chest_Cards';
import chance from '../library/cards/Chance_Cards';

const useEffects = () => {
  const communityEffect = (player) => {
    const card = communityChest.pop();
    switch(card.number) {
      case 15:
        console.log(card.text);
        //You inherit $100
        player.setMoney(100);
        break;
      case 14:
        console.log(card.text);
        //You have won second prize in a beauty contest. Collect $10
        player.setMoney(10);
        break;
      case 13:
        console.log(card.text);
        //You are assessed for street repairs. $40 per house. $115 per hotel (You own)
        break;
      case 12:
        console.log(card.text);
        //Receive $25 consultancy fee
        player.setMoney(25);
        break;
      case 11:
        console.log(card.text);
        //Pay school fees of $50
        player.setMoney(-50);
        break;
      case 10:
        console.log(card.text);
        //Pay hospital fees of $100
        player.setMoney(-100);
        break;
      case 9:
        console.log(card.text);
        //Life insurance matures. Collect $100
        player.setMoney(100);
        break;
      case 8:
        console.log(card.text);
        //It is your birthday. Collect $10 from every player
        break;
      case 7:
        console.log(card.text);
        //Income tax refund. Collect $20
        player.setMoney(20);
        break;
      case 6:
        console.log(card.text);
        //Holiday fund matures. Collect $100
        player.setMoney(100);
        break;
      case 5:
        console.log(card.text);
        //go to jail
        player.setJail(true);
        break;
      case 4:
        console.log(card.text);
        player.cc_JailCard = true;
        //Get Out of Jail Free card
        break;
      case 3:
        console.log(card.text);
        //From sale of stock you get $50
        player.setMoney(50);
        break;
      case 2:
        console.log(card.text);
        //Doctor's fee. Pay $50
        player.setMoney(-50);
        break;
      case 1:
        console.log(card.text);
        //Bank error in your favor. Collect $200
        player.setMoney(200);
        break;
      case 0:
        console.log(card.text);
        //Advance to 'GO' (Collect $200)
        player.setMoney(200);
        break;
      
    }
  }

  const chanceEffect = async (player) => {
    const card = chance.pop()
    switch(card.number) {
      case 15:
        console.log(card.text);
        //Your building and loan matures. Collect $150
        console.log(player.money, "before");
        player.setMoney(150);
        console.log(player.money, "after");
        break;
      case 14:
        console.log(card.text);
        //Pay each player $50
        break;
      case 13:
        console.log(card.text);
        //Advance to Boardwalk
        player.setLocation("Boardwalk", 39)
        break;
      case 12:
        console.log(card.text);
        //Take a trip to Reading Railroad. If you pass 'GO' collect $200
        if (player.index > 7)
          player.setMoney(200);
        player.setLocation("Reading Railroad", 5);
        break;
      case 11:
        console.log(card.text);
        //Speeding fine $15
        player.setMoney(-15);
        break;
      case 10:
        console.log(card.text);
        //Make general repairs on all your property. For each house pay $25. For each hotel $100
        break;
      case 9:
        console.log(card.text);
        //go to jail
        player.setJail(true);
        break;
      case 8:
        console.log(card.text);
        //Go Back 3 Spaces
        player.setLocation(board[player.index-3].name , player.index-3);
        //console.log(board[player.index].name);
        break;
      case 7:
        console.log(card.text);
        //Get Out of Jail Free
        player.c_JailCard = true;
        break;
      case 6:
        console.log(card.text);
        //Bank pays you dividend of $50
        player.setMoney(50);
        break;
      case 5:
        console.log(card.text);
        //Advance token to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay the owner twice the rental to which they are otherwise entitled
        if (player.index === 36) {
          console.log("RRR");
          player.setLocation("Reading Railroad", 5); //does collect 200?
          player.setMoney(200);
          if(board[5].owned === false) {
            await promptUnowned(5);
          }
          else {
            //pay board[5].owner
          }
        }
        else if (player.index === 7) {
          console.log("PRR");
          player.setLocation("Pennsylvania Railroad", 15);
          if(board[15].owned === false) {
            await promptUnowned(15);
          }
          else {
            //pay board[15].owner
          }
        }
        else if (player.index === 22){
          console.log("BORR")
          player.setLocation("B. & O. Railroad", 25);
          if(board[25].owned === false) {
            await promptUnowned(25);
          }
          else {
            //pay board[25].owner
          }
        }
        //cant get advance to short line
        break;
      case 4:
        console.log(card.text);
        //copy paste case 5 when done since same
      case 3:
        console.log(card.text);
        //Advance to the nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown
        if (player.index === 36|| player. index === 7) {
          player.setLocation("Electric Company", 12)
          if(board[12].owned === true) {
            await promptUnowned(12);
          }
          else {
            payUtilities(player);
            //pay the owner pay 10x dice
          }
        }
        else if (player.index === 22) {
          player.setLocation("Water Works", 28)
          if(board[22].owned === true) {
            await promptUnowned(22);
          }
          else {
            payUtilities(player);
            //pay the owner pay 10x dice
          }
        }
        break;
      case 2:
        console.log(card.text);
        //Advance to St. Charles Place. If you pass 'GO' collect $200
        if (player.index > 21)
          player.setMoney(200);
        player.setLocation("St. Charles Place", 11)
        break;
      case 1:
        console.log(card.text);
        //Advance to Illinois Avenue. If you pass 'GO' collect $200
        if (player.index > 35)
          player.setMoney(200);
        player.setLocation("Illinois Avenue", 24)
        break;
      case 0:
        console.log(card.text);
        //Advance to Go (Collect $200)
        player.setMoney(200);
        player.setLocation("Go", 0);
        break;
    }
  }

  const payUtilities = (player) => {
    var die1 = Math.floor(Math.random() * 6) + 1;
    var die2 = Math.floor(Math.random() * 6) + 1;
    var temp = (die1+die2)*10;
    console.log(temp);
    player.setMoney(-temp);
  }
 

  //fix async later
  const promptUnowned = (index) => new Promise(function(resolve, reject) {
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
        return true;
      }
    })
  })

  return [communityEffect, chanceEffect];
}
export default useEffects;