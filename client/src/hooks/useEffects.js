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

  const chanceEffect = (player) => {
    const card = chance.pop()
    switch(card.number) {
      case 15:
        console.log(card.text);
        //Your building and loan matures. Collect $150
        player.setMoney(150);
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
        if (player.index > 6)
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
        player.jail = true;
        break;
      case 8:
        console.log(card.text);
        //Go Back 3 Spaces
        player.setLocation(board[player.index-3].name , player.index-3);
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
        //5 = Reading Railroad
        //15 = Pennsylvania Railroad
        //25 = B. & O. Railroad
        //35 = Short Line Railroad
        //
        //or check current index and just Tp to next RR spot
        break;
      case 4:
        console.log(card.text);
        //Advance token to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay the owner twice the rental to which they are otherwise entitled
        break;
      case 3:
        console.log(card.text);
        //Advance to the nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown
        break;
      case 2:
        console.log(card.text);
        //Advance to St. Charles Place. If you pass 'GO' collect $200
        if (player.index >21)
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
  return [communityEffect, chanceEffect];
}
export default useEffects;