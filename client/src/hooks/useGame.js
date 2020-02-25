import Swal from 'sweetalert2';

import board from '../library/board/board.js';
import useEffects from '../hooks/useEffects';
import Deeds from '../classes/Deeds';

const useGame = (addToHistory) => {
  const [communityEffect, chanceEffect] = useEffects();
  
  var die1, die2;

  const endTurn = () => {
    
  }
  
  const diceRoll = () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    //die1=39;
    //die2=0;
    // console.log(die1, die2);
  }

  const rollEvent = async (player, player2) => {
    await payJail(player);
    
    //board[37].owned = true;
    //board[37].owner = player2;
    //board[39].owned = true;
    //board[39].owner = player2;
    //board[14].owned = true;
    //board[14].owner = player2;

    if (player.jail === false) {
      diceRoll();
      if (die1 === die2) {
        if (player.doubles === 2) {
          addToHistory("Triple Doubles, Go to Jail")
          player.setJail(true);
          player.resetDoubles();
        }
        else {
          player.setDoubles();
          addToHistory(player.doubles, " Double");
          movePlayer(player, die1+die2);
        }
      }
      else {
        movePlayer(player, die1+die2);
        player.resetDoubles();
      }
    }
    else if (player.jail === true) {
      diceRoll();
      if (die1 === die2) {
        addToHistory("freed from jail");
        player.setJail(false);
        player.resetJailroll();
        player.setLocation("Just Visiting", 10);
        movePlayer(player, die1+die2);
      } else {
        if (player.jailroll === 2) {
          if (player.money > 49) {
            addToHistory("failed last doubles attempt, $50 was taken from you");
            player.setMoney(-50);
            player.setJail(false);
            player.resetJailroll();
            player.setLocation("Just Visiting", 10);
            movePlayer(player, die1+die2);
          } else {
            console.log("trigger selling mode");
            sellStuff = (player, 50)
          }
        }
        else {
          player.setJailroll(); 
          addToHistory("failed doubles roll");
        }
      }
    }
  }

  const payJail = (player) => new Promise(function(resolve, reject) {
    if (player.jail === false)
      resolve (false);
    else if (player.money > 49) {
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
          addToHistory(player.money);
          resolve(true);
        }
        else {
          resolve (false);
        }
      })
    }
    else resolve (false);
  })

  const movePlayer = async (player, roll) => {
    //save state here maybe?
    if (player.index + roll > 39) {
      addToHistory(player.money,"Pass go collect 200");
      player.setMoney(200);
      addToHistory(player.money);
    }
    player.setLocation( board[((player.index+roll)%40)].name, ((player.index+roll)%40));
    addToHistory(player.location);
    if (board[player.index].type !== "Tile" && board[player.index].type !== "Event") {
      await checkOwner(player);
    } else {
      if (board[player.index].name === "Community Chest") {
        addToHistory("Community Chest");
        communityEffect(player);  
      }
      else if (board[player.index].name === "Chance") {
        addToHistory("Chance");
        chanceEffect(player);
      }
      else if (board[player.index].name === "Income Tax") {
        addToHistory("Income Tax");
        if (player.money < 200) {
          sellStuff(player, 200);
        }
        else {
          player.setMoney(-200);
          addToHistory(player.money);
        }
      }
      else if (board[player.index].name === "Go To Jail") {
        addToHistory("Jail");
        player.setJail(true);
      }
      else if (board[player.index].name === "Luxury Tax") {
        addToHistory("Lux Tax");
        if (player.money < 100) {
          sellStuff(player, 100);
        }
        else {
          player.setMoney(-100);
          addToHistory(player.money);
        }
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
          board[player.index].owner = player;
          player.addInventory(new Deeds(board[player.index].name, board[player.index].type, player.index, board[player.index].rentNormal));
          console.log(player.inventory);
          addToHistory(player.money);
        }
        else {
          //work on bidding after get multiple players
          //if no bidding begins
          //window pop up to prompt bid amount
          addToHistory("bidding begins");
        }
      })
    }
    else if (board[player.index].owned === true) {
      if (board[player.index].owner.name !== player.name) {
        if (board[player.index].type === "Utilities") {
          var amount = 0;
          if (board[28].owner.name === board[12].owner.name) {
            amount = 10 * (die1 + die2);  
            addToHistory("pay " + board[player.index].owner.name + " $" + amount);
            if (player.money < amount) {
              sellStuff(player, amount);
            }
            else {
              player.setMoney(-amount);
              board[player.index].owner.setMoney(amount);
            }
          }
          else {
            amount = 4 * (die1 + die2);
            addToHistory("pay " + board[player.index].owner.name + " $" + amount);
            if (player.money < amount) {
              sellStuff(player, amount);
            }
            else {
              player.setMoney(-amount);
              board[player.index].owner.setMoney(amount);
            }
          }
        }
        //=============================
        else if (board[player.index].type === "Railroad") {
          var temp = 0;
          if (board[player.index].owner.name === board[5].owner.name)
            temp++;
          if (board[player.index].owner.name === board[15].owner.name)
            temp++;
          if (board[player.index].owner.name === board[25].owner.name)
            temp++;
          if (board[player.index].owner.name === board[35].owner.name)
            temp++;
          if (temp === 1) {
            player.setMoney(-25);
            board[player.index].owner.setMoney(25)
          }
          else if (temp === 2) {
            player.setMoney(-50);
            board[player.index].owner.setMoney(50)
          }
          else if (temp ===3) {
            player.setMoney(-100);
            board[player.index].owner.setMoney(100);
          }
          else if (temp ===4) {
            player.setMoney(-200);
            console.log(player.money);
            board[player.index].owner.setMoney(200);
          }

        }
        //=============================
        else {
          var amount = 0;
          if (board[player.index].house === 1)
            amount = board[player.index].rentHouse1;
          else if (board[player.index].house === 2)
            amount = board[player.index].rentHouse2;
          else if (board[player.index].house === 3)
            amount = board[player.index].rentHouse3;
          else if (board[player.index].house === 4)
            amount = board[player.index].rentHouse4;
          else if (board[player.index].house === 5)
            amount = board[player.index].rentHotel;
          else {
            if (monopolyRent(player.index) === true) {
              amount = 2 * board[player.index].rentNormal
              console.log("double rent ", amount);
            } else {
              amount = board[player.index].rentNormal
              console.log("normal rent ", amount);
            }
          }

          addToHistory("pay " + board[player.index].owner.name + " $" + amount);
          if (player.money < amount) {
            sellStuff(player, amount);
          }
        }
      }
    }
  })

  const monopolyRent = (i) => {
    if (board[i].color === "Brown") {
      //1 3
      return monopoly2Check(1, 3);
    }
    else if (board[i].color === "Light Blue") {
      //6 8 9
      return monopoly3Check(6, 8, 9);
    }
    else if (board[i].color === "Pink") {
      //11 13 14
      return monopoly3Check(11, 13, 14);
    }
    else if (board[i].color === "Orange") {
      //16 18 19
      return monopoly3Check(16, 18, 19);
    }
    else if (board[i].color === "Red") {
      //21 23 24
      return monopoly3Check(21, 23, 24);
    }
    else if (board[i].color === "Yellow") {
      //26 27 29
      return monopoly3Check(26, 27, 29);
    }
    else if (board[i].color === "Green") {
      //31 32 34
      return monopoly3Check(31, 32, 34);
    }
    else if (board[i].color === "Dark Blue") {
      //37 39
      return monopoly2Check(37, 39);
    }
    return false;
  }

  const monopoly3Check = (p1, p2, p3) => {
    if (board[p1].owner.name === board[p2].owner.name && board[p1].owner.name === board[p3].owner.name) {
      return true
    }
  }

  const monopoly2Check = (p1, p2) => {
    if (board[p1].owner.name === board[p2].owner.name) {
      return true
    }
  }

  const sellStuff = (player, amount) => new Promise(function(resolve, reject) {
    if (player.inventory.length > 0) {
        //gui pop displaying items
    }
    else {
      addToHistory("player bankrupt");
      //from here disable buton for bankrupt player
    }
  })

  return [rollEvent];
}

export default useGame;