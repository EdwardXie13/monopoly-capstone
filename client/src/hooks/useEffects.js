import Swal from "sweetalert2";

import communityChest from '../library/cards/Community_Chest_Cards';
import chance from '../library/cards/Chance_Cards';

const useEffects = () => {
  const communityEffect = (player) => {
    const card = communityChest.pop();
    switch(card.number) {
      case 15:
        console.log(card.text);
        player.setMoney(100);
        break;
      case 14:
        console.log(card.text);
        player.setMoney(10);
        break;
      case 13:
        console.log(card.text);
        //You are assessed for street repairs. $40 per house. $115 per hotel (You own)
        break;
      case 12:
        console.log(card.text);
        player.setMoney(25);
        break;
      case 11:
        console.log(card.text);
        player.setMoney(-50);
        break;
      case 10:
        console.log(card.text);
        player.setMoney(-100);
        break;
      case 9:
        console.log(card.text);
        player.setMoney(100);
        break;
      case 8:
        console.log(card.text);
        //It is your birthday. Collect $10 from every player
        break;
      case 7:
        console.log(card.text);
        player.setMoney(20);
        break;
      case 6:
        console.log(card.text);
        player.setMoney(100);
        break;
      case 5:
        console.log(card.text);
        //go to jail
        player.jail = true;
        break;
      case 4:
        console.log(card.text);
        cc_JailCard = true;
        //Get Out of Jail Free card
        break;
      case 3:
        console.log(card.text);
        player.setMoney(50);
        break;
      case 2:
        console.log(card.text);
        player.setMoney(-50);
        break;
      case 1:
        console.log(card.text);
        player.setMoney(200);
        break;
      case 0:
        console.log(card.text);
        player.setMoney(200);
        break;
      
    }
  }

  // const chanceEffect = (player) => {
  //   const card = chance.pop();
  //   console.log(card.text);
  //   if (card.text = "")
  // }
  return [communityEffect];
}
export default useEffects;