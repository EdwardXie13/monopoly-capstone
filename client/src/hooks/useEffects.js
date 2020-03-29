import Swal from 'sweetalert2';

import board from '../library/board/board.js';
import communityChest from '../library/cards/Community_Chest_Cards';
import chance from '../library/cards/Chance_Cards';
import Deeds from '../classes/Deeds.js';
//player, money, location, inventory, index
const useEffects = (reactDice, setUtilityDice, handleBuyProp, addToHistory, setOpenBid, setName, handleSetPropName, monopolyRent, railroadRent, payRent, gamers, handlePlayerChange, me, setActivator, handleSetFinishedPlayer) => {
  const communityEffect = async(player) => {
    const card = communityChest.pop();
    switch(card.number) {
      case 15:
        console.log(card.text);
        //You inherit $100
        player.money += 100;
        break;
      case 14:
        console.log(card.text);
        //You have won second prize in a beauty contest. Collect $10
        player.money += 10;
        break;
      case 13:
        console.log(card.text);
        //You are assessed for street repairs. $40 per house. $115 per hotel (You own)
        let repairFee = 0;
        for (let i=0; i<player.inventory.length; ++i) {
          if (player.inventory[i].house === 5) repairFee += 115
          repairFee += player.inventory[i].house * 40  
        }
        // player.money -= repairFee;
        payRent(player, repairFee);
        break;
      case 12:
        console.log(card.text);
        //Receive $25 consultancy fee
        player.money += 25;
        break;
      case 11:
        console.log(card.text);
        //Pay school fees of $50
        payRent(player, 50);
        break;
      case 10:
        console.log(card.text);
        //Pay hospital fees of $100
        payRent(player, 100);
        break;
      case 9:
        console.log(card.text);
        //Life insurance matures. Collect $100
        player.money += 100;
        break;
      case 8:
        console.log(card.text);
        //It is your birthday. Collect $10 from every player
        let temp = 0;
        setActivator(gamers[me.current]);
        for (let key of Object.keys(gamers)) {
          if (key !== me.current) {
            if (gamers[key].bankrupt === false) {
              temp++;
              if (gamers[key].money < 10) {
                console.log("player's turn", gamers[key]);
                await payRent(gamers[key], 10, null, gamers[me.current]);
                handleSetFinishedPlayer({ name: '' });
              } else {
                handlePlayerChange(gamers[key].name, gamers[key].money - 10, gamers[key].location, gamers[key].inventory, gamers[key].index);
              }
              // console.log("after paying rent", gamers[key].money - 10);
            }
          }
        }
        setActivator(null);
        // handlePlayerChange(gamers[player.name].name, gamers[player.name].money + (10 * temp), gamers[player.name].location, gamers[player.name].inventory, gamers[player.name].index);
        break;
      case 7:
        console.log(card.text);
        //Income tax refund. Collect $20
        player.money += 20;
        break;
      case 6:
        console.log(card.text);
        //Holiday fund matures. Collect $100
        player.money += 100;
        break;
      case 5:
        console.log(card.text);
        //go to jail
        player.jail = true;
        break;
      case 4:
        console.log(card.text);
        player.cc_JailCard = true;
        //Get Out of Jail Free card
        break;
      case 3:
        console.log(card.text);
        //From sale of stock you get $50
        player.money += 50;
        break;
      case 2:
        console.log(card.text);
        //Doctor's fee. Pay $50
        payRent(player, 50);
        break;
      case 1:
        console.log(card.text);
        //Bank error in your favor. Collect $200
        player.money += 200;
        break;
      case 0:
        console.log(card.text);
        //Advance to 'GO' (Collect $200)
        player.money += 200;
        break;
      
    }
  }

  const chanceEffect = async (player) => {
    const card = chance.pop()
    switch(card.number) {
      case 15:
        console.log(card.text);
        //Your building and loan matures. Collect $150
        // player.setMoney(150);
        player.money += 150;
        break;
      case 14:
        console.log(card.text);
        //Pay each player $50
        break;
      case 13:
        console.log(card.text);
        //Advance to Boardwalk
        // player.setLocation("Boardwalk", 39)
        player.location = "Boardwalk";
        player.index = 39;

        getRent(player);
        break;
      case 12:
        console.log(card.text);
        //Take a trip to Reading Railroad. If you pass 'GO' collect $200
        if (player.index > 7)
          // player.setMoney(200);
          player.money += 200;
        // player.setLocation("Reading Railroad", 5);
        player.location = "Reading Railroad";
        player.index = 5;

        let rent = 2 * railroadRent(player);
        await payRent(player, rent);
        break;
      case 11:
        console.log(card.text);
        //Speeding fine $15
        // player.money -= 15;
        await payRent(player, 15)
        break;
      case 10:
        console.log(card.text);
        //Make general repairs on all your property. For each house pay $25. For each hotel $100
        let repairFee = 0;
        for (let i=0; i<player.inventory.length; ++i) {
          if (player.inventory[i].house === 5) repairFee += 115
          repairFee += player.inventory[i].house * 40  
        }
        // player.money -= repairFee;
        payRent(player, repairFee);
        break;
      case 9:
        console.log(card.text);
        //go to jail
        // player.setJail(true);
        player.jail = true;
        break;
      case 8:
        console.log(card.text);
        //Go Back 3 Spaces
        // player.setLocation(board[player.index-3].name , player.index-3);
        player.location = board[player.index-3].name;
        player.index = player.index-3;
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
        // player.setMoney(50);
        player.money += 50;
        break;
      case 5:
        console.log(card.text);
        //Advance token to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay the owner twice the rental to which they are otherwise entitled
        if (player.index === 36) {
          console.log("RRR");
          player.location = "Reading Railroad";
          player.index = 5;
          player.money += 200;
          if (board[player.index].owned === false) {
            promptUnowned(player);
            console.log("paid", player.money);
          } else {
            let rent = 2 * railroadRent(player);
            console.log("rent", rent)
            await payRent(player, rent);
          }
        }
        else if (player.index === 7) {
          console.log("PRR");
          // player.setLocation("Pennsylvania Railroad", 15);
          player.location = "Pennsylvania Railroad";
          player.index = 15;
          
          if (board[player.index].owned === false) {
            promptUnowned(player);
          } else {
            let rent = 2 * railroadRent(player);
            await payRent(player, rent);
          }
        }
        else if (player.index === 22){
          console.log("BORR")
          // player.setLocation("B. & O. Railroad", 25);
          player.location = "B. & O. Railroad";
          player.index = 25;

          if (board[player.index].owned === false) {
            promptUnowned(player);
          } else {
            let rent = 2 * railroadRent(player);
            await payRent(player, rent);
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
          // player.setLocation("Electric Company", 12)
          player.location = "Electric Company";
          player.index = 12;
          if(board[12].owned === true) {
            await promptUnowned(player, 12);
          }
          else {
            //re throw pay the owner pay 10x dice
            rollUtilityDice(player);
          }
        }
        else if (player.index === 22) {
          // player.setLocation("Water Works", 28)
          player.location = "Water works";
          player.index = 28;
          if(board[22].owned === true) {
            await promptUnowned(player, 22);
          }
          else {
            //re throw pay the owner pay 10x dice
            rollUtilityDice(player);
          }
        }
        break;
      case 2:
        console.log(card.text);
        //Advance to St. Charles Place. If you pass 'GO' collect $200
        if (player.index > 21)
          // player.setMoney(200);
          player.money += 200;
        // player.setLocation("St. Charles Place", 11)
        player.location = "St. Charles Place";
        player.index = 11;
        getRent(player);
        break;
      case 1:
        console.log(card.text);
        //Advance to Illinois Avenue. If you pass 'GO' collect $200
        if (player.index > 35)
          player.money += 200;
        player.location = "Illinois Avenue";
        player.index = 24;

        getRent(player);
        break;
      case 0:
        console.log(card.text);
        //Advance to Go (Collect $200)
        // player.setMoney(200);
        player.money += 200;
        player.location = "Go";
        player.index = 0;
        break;
    }
  }
  const getRent = async (player) => {
    if (board[player.index].owned === true) {
      let rent = 0;
      if (board[player.index].house === 0) {
        if (monopolyRent(player.index) ) {
          rent = 2 * board[player.index].rentNormal
        } else rent = board[player.index].rentNormal;
      } else if (board[player.index].house === 1) {
        rent = board[player.index].rentHouse1;
      } else if (board[player.index].house === 2) {
        rent = board[player.index].rentHouse2;
      } else if (board[player.index].house === 3) {
        rent = board[player.index].rentHouse3;
      } else if (board[player.index].house === 4) {
        rent = board[player.index].rentHouse3;
      } else rent = board[player.index].rentHotel;

      await payRent(player, rent);
    } else {
      await promptUnowned(player);
    }
  }

  const rollUtilityDice = async (player) => {
    await setUtilityDice(true);
    reactDice.rollAll();
    const rent = 10 * reactDice.diceContainer.dice[0].state.currentValue + reactDice.diceContainer.dice[1].state.currentValue;
    await payRent(player, rent);
  }
 
  const promptUnowned = (player) => new Promise(function(resolve, reject) {
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
        handleBuyProp(player.index, player);
        addToHistory(`player has acquired ${board[player.index].name}`);
        resolve("done");
      }
      else {
        addToHistory("bidding begins");
        setName(board[player.index].name);
        handleSetPropName(board[player.index].name);
        setOpenBid(true);
      }
    })
  })

  return [communityEffect, chanceEffect];
}
export default useEffects;