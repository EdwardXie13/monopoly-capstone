import Swal from 'sweetalert2';
import board from '../library/board/board.js';
import useEffects from '../hooks/useEffects';
import Deeds from '../classes/Deeds';

const useGame = (addToHistory, setOpenBid, setName, handleBuyProp) => {
  const [communityEffect, chanceEffect] = useEffects();

  const rollEvent = async (die1, die2, player, setIsRolled, setDouble) => { 
    if (player.bankrupt === false) {
      // await payJail(player);

      if (player.jail === false) {
        if (die1 === die2) {
          if (player.doubles === 2) {
            addToHistory("Triple Doubles, Go to Jail")
            player.doubles = 0;
            setDouble(0);
            setIsRolled(true);
            // player.setJail(true);
            player.jail = true;
            // player.resetDoubles();
          }
          else {
            // player.setDoubles();
            player.doubles++;
            setDouble(prevDouble => prevDouble + 1);
            setIsRolled(false);
            addToHistory(player.doubles, " Double");
            movePlayer(die1, die2, player);
          }
        }
        else {
          movePlayer(die1, die2, player);
          // player.resetDoubles();
          player.doubles = 0;
          setDouble(0);
          setIsRolled(true);
        }
      }
      else if (player.jail === true) {
        if (die1 === die2) {
          addToHistory("freed from jail");
          // player.setJail(false);
          player.jail = false;
          // player.resetJailroll();
          player.jailroll = 0;
          // player.setLocation("Just Visiting", 10);
          player.location = "Just Visiting";
          player.index = 10;
          movePlayer(die1, die2, player);
        } else {
          if (player.jailroll === 2) {
            if (player.money > 49) {
              addToHistory("failed last doubles attempt, $50 was taken from you");
              // player.setMoney(-50);
              player.money -= 50;
              // player.setJail(false);
              player.jail = false;
              // player.resetJailroll();
              player.jailroll = 0;
              // player.setLocation("Just Visiting", 10);
              player.location = "Just Visiting";
              player.index = 10;
              movePlayer(die1, die2, player);
            } else {
              console.log("trigger selling mode");
              sellStuff = (player, 50)
            }
          }
          else {
            // player.setJailroll();
            player.jailroll = 0;
            addToHistory("failed doubles roll");
          }
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
          // player.setJail(false);
          player.jail = false;
          // player.setMoney(-50);
          player.money -= 50;
          // player.setLocation("Just Visiting", 10)
          player.location = "Just Visiting";
          player.index = 10;
          addToHistory(player.money);
          resolve("done");
        }
        else {
          resolve("done");
        }
      })
    }
    else resolve("done");
  })

  const movePlayer = async (die1, die2, player) => {
    //save state here maybe?
    if (player.index + die1 + die2 > 39) {
      addToHistory(player.money,"Pass go collect 200");
      // player.setMoney(200);
      player.money += 200;
      addToHistory(player.money);
    }
    console.log("player", player);
    // player.setLocation( board[((player.index+die1 + die2)%40)].name, ((player.index+die1 + die2)%40));
    player.location = board[((player.index + die1 + die2)%40)].name;
    player.index = (player.index+die1 + die2)%40;

    addToHistory(player.location);
    if (board[player.index].type !== "Tile" && board[player.index].type !== "Event") {
      await checkOwner(die1, die2, player);
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
          // player.setMoney(-200);
          player.money += 200;
          addToHistory(player.money);
        }
      }
      else if (board[player.index].name === "Go To Jail") {
        addToHistory("Jail");
        // player.setJail(true);
        player.jail = true;
      }
      else if (board[player.index].name === "Luxury Tax") {
        addToHistory("Lux Tax");
        if (player.money < 100) {
          sellStuff(player, 100);
        }
        else {
          // player.setMoney(-100);
          player.money -= 100;
          addToHistory(player.money);
        }
      }
    }
  }
  
  const checkOwner = (die1, die2, player) => new Promise(function(resolve, reject) {
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
          // player.setMoney(-board[player.index].price);
          // player.money -= board[player.index].price;
          // board[player.index].owned = true;
          // board[player.index].owner = player;
          handleBuyProp(player.index, player);
          // player.addInventory(new Deeds(board[player.index].name, board[player.index].type, player.index, board[player.index].rentNormal));
          addToHistory(player.money);
          resolve("done");
        }
        else {
          addToHistory("bidding begins");
          setName(board[player.index].name);
          setOpenBid(true);
          resolve("done");
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
              resolve("done");
            }
            else {
              // player.setMoney(-amount);
              player.money -= amount;
              // board[player.index].owner.setMoney(amount);
              board[player.index].owner.money += amount;
              resolve("done");
            }
          }
          else {
            amount = 4 * (die1 + die2);
            addToHistory("pay " + board[player.index].owner.name + " $" + amount);
            if (player.money < amount) {
              sellStuff(player, amount);
              resolve("done");
            }
            else {
              // player.setMoney(-amount);
              player.money -= amount;
              // board[player.index].owner.setMoney(amount);
              board[player.index].owner.money += amount;
              resolve("done");
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
            // player.setMoney(-board[player.index].rentNormal);
            player.money -= board[player.index].rentNormal
            // board[player.index].owner.setMoney(board[player.index].rentNormal)
            board[player.index].owner.money += board[player.index].rentNormal;
            resolve("done");
          }
          else if (temp === 2) {
            // player.setMoney(-board[player.index].rentRR2);
            player.money -= board[player.index].rentRR2;
            // board[player.index].owner.setMoney(board[player.index].rentRR2)
            board[player.index].owner.money += board[player.index].rentRR2;
            resolve("done");
          }
          else if (temp ===3) {
            // player.setMoney(-board[player.index].rentRR3);
            player.money -= board[player.index].rentRR3;
            // board[player.index].owner.setMoney(board[player.index].rentRR3);
            board[player.index].owner.money += board[player.index].rentRR3;
            resolve("done");
          }
          else if (temp ===4) {
            // player.setMoney(-board[player.index].rentRR4);
            player.money -= board[player.index].rentRR4;
            // board[player.index].owner.setMoney(board[player.index].rentRR4);
            board[player.index].owner.money += board[player.index].rentRR4;
            resolve("done");
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
            resolve("done");
          } else {
            // player.setMoney(-amount);
            player.money -= amount;
            // board[player.index].owner.setMoney(amount);
            board[player.index].owner.money += amount;
            resolve("done");
          }
        }
      }
    }
  })

  const monopolyRent = (i) => {
    if (board[i].color === "Brown") {
      //1 3
      return monopolyCheck(1, 3, 0);
    }
    else if (board[i].color === "Light Blue") {
      //6 8 9
      return monopolyCheck(6, 8, 9);
    }
    else if (board[i].color === "Pink") {
      //11 13 14
      return monopolyCheck(11, 13, 14);
    }
    else if (board[i].color === "Orange") {
      //16 18 19
      return monopolyCheck(16, 18, 19);
    }
    else if (board[i].color === "Red") {
      //21 23 24
      return monopolyCheck(21, 23, 24);
    }
    else if (board[i].color === "Yellow") {
      //26 27 29
      return monopolyCheck(26, 27, 29);
    }
    else if (board[i].color === "Green") {
      //31 32 34
      return monopolyCheck(31, 32, 34);
    }
    else if (board[i].color === "Dark Blue") {
      //37 39
      return monopolyCheck(37, 39, 0);
    }
    return false;
  }

  const monopolyCheck = (p1, p2, p3) => {
    if (p3 == 0) {
      if (board[p1].owner.name === board[p2].owner.name) {
        return true
      }
    }
    else if (board[p1].owner.name === board[p2].owner.name && board[p1].owner.name === board[p3].owner.name) {
      return true
    }
  }

  const sellStuff = (player, amount) => new Promise(function(resolve, reject) {
    if (player.inventory.length > 0 || player.cc_JailCard === true || player.c_JailCard === true) {  
      //gui pop displaying items and all other players + bank
    } 
    else {
      addToHistory("player bankrupt");
      player.bankrupt = true;
    }
  })

  return [rollEvent, payJail];
}

export default useGame;