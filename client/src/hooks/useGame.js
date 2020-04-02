import Swal from 'sweetalert2';
import board from '../library/board/board.js';
import useEffects from '../hooks/useEffects';

const useGame = (addToHistory, setOpenBid, setName, handleBuyProp, handlePlayerChange, reactDice, setUtilityDice, handleSetPropName, gamers, me, setShowManage, setOpenBuild, setRent, setResolvePayment, handleOpenBuildWindow, setActivator, finishedPlayer, handleSetFinishedPlayer, setInitialRent) => {
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

  const railroadRent = (player) => {
    let count = 0;
    if (board[player.index].owner.name === board[5].owner.name)
      count++;
    if (board[player.index].owner.name === board[15].owner.name)
      count++;
    if (board[player.index].owner.name === board[25].owner.name)
      count++;
    if (board[player.index].owner.name === board[35].owner.name)
      count++;
    
    if (count === 1) {
      return board[player.index].rentNormal;
    } else if (count === 2) {
      return board[player.index].rentRR2;
    } else if (count === 3) {
      return board[player.index].rentRR3;
    } else if (count === 4) {
      return board[player.index].rentRR4;
    }
  }
  //passed in gamers, refactor code
  const payRent = (player, rent, loanShark, activator) => new Promise(async function(resolve, reject) {
    const debtChecker = /*new Promise (async (resolve2, reject2)*/() => {
      if (player.money < rent) {
        const prevPlayerMoney = player.money;
        setRent(rent - prevPlayerMoney);
        setInitialRent(prevPlayerMoney);
        player.money = 0;
        handleOpenBuildWindow(player, rent - prevPlayerMoney, loanShark );
       }
    }//);

    /*.then(res => {
      console.log("promise resolve value:", res);
      console.log("tax", gamers[player.name])
      handlePlayerChange(gamers[player.name].name, gamers[player.name].money - rent, player.location, player.inventory, player.index);
  
      if (board[player.index].type !== "Tile") {
        handlePlayerChange(board[player.index].owner.name, gamers[board[player.index].owner.name].money + rent, board[player.index].owner.location, board[player.index].owner.inventory, board[player.index].owner.index);
      }
      resolve("done");
    });*/

    debtChecker();


    const interval = setInterval(() => {
      console.log("payrent still running.", finishedPlayer.current.name, player.name, finishedPlayer.name === player.name);
      if (finishedPlayer.current.name === player.name) {
        clearInterval(interval);
        console.log("resolved");
        resolve("ok");
      }
    }, 1000);

    if (activator === undefined) { 
      console.log("ended")
      clearInterval(interval);
      resolve("ok");
    }
    
    

  });

  const [communityEffect, chanceEffect] = useEffects(reactDice, setUtilityDice, handleBuyProp, addToHistory, setOpenBid, setName, handleSetPropName, monopolyRent, railroadRent, payRent, gamers, handlePlayerChange, me, setActivator, handleSetFinishedPlayer);

  const rollEvent = async (die1, die2, player, setIsRolled, setDouble) => { 
    if (player.bankrupt === false) {
      if (player.jail === false) {
        if (die1 === die2) {
          if (player.doubles === 2) {
            addToHistory("Triple Doubles, Go to Jail")
            player.doubles = 0;
            setDouble(0);
            setIsRolled(true);
            player.jail = true;
          }
          else {
            player.doubles++;
            setDouble(prevDouble => prevDouble + 1);
            setIsRolled(false);
            addToHistory(player.doubles, " Double");
            movePlayer(die1, die2, player);
          }
        }
        else {
          movePlayer(die1, die2, player);
          player.doubles = 0;
          setDouble(0);
          setIsRolled(true);
        }
      }
      else if (player.jail === true) {
        if (die1 === die2) {
          addToHistory("freed from jail");
          player.jail = false;
          player.jailroll = 0;
          player.location = "Just Visiting";
          player.index = 10;
          movePlayer(die1, die2, player);
        } else {
          if (player.jailroll === 2) {
            if (player.money > 49) {
              addToHistory("failed last doubles attempt, $50 was taken from you");
              player.money -= 50;
              player.jail = false;
              player.jailroll = 0;
              player.location = "Just Visiting";
              player.index = 10;
              handlePlayerChange(player.name, gamers[player.name].money - 50, player.location, player.inventory, player.index);
              movePlayer(die1, die2, player);
            } else {
              console.log("trigger selling mode");
              payRent(player, 50);
            }
          }
          else {
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
          player.jail = false;
          player.money -= 50;
          player.location = "Just Visiting";
          player.index = 10;
          handlePlayerChange(player.name, gamers[player.name].money - 50, player.location, player.inventory, player.index);
          addToHistory(player.money);
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
      player.money += 200;
      handlePlayerChange(player.name, gamers[player.name].money + 200, player.location, player.inventory, player.index);
      addToHistory(player.money);
    }
    // player.setLocation( board[((player.index+die1 + die2)%40)].name, ((player.index+die1 + die2)%40));
    player.location = board[((player.index + die1 + die2)%40)].name;
    console.log("player", player.location);
    player.index = (player.index+die1 + die2)%40;

    addToHistory(player.location);
    if (board[player.index].type !== "Tile" && board[player.index].type !== "Event") {
      await checkOwner(die1, die2, player);
    } else {
      if (board[player.index].name === "Community Chest") {
        addToHistory("Community Chest");
        communityEffect(player);  
      } else if (board[player.index].name === "Chance") {
        addToHistory("Chance");
        chanceEffect(player);
      } else if (board[player.index].name === "Income Tax") {
        addToHistory("Income Tax");
        await payRent(player, 200, "Board");
      } else if (board[player.index].name === "Go To Jail") {
        addToHistory("Jail");
        player.jail = true;
      } else if (board[player.index].name === "Luxury Tax") {
        addToHistory("Lux Tax");
        await payRent(player, 100, "Board");
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
          // player.money -= board[player.index].price;
          board[player.index].owner = player;
          handleBuyProp(player.index, player);
          addToHistory(player.money);
        }
        else {
          addToHistory("bidding begins");
          setName(board[player.index].name);
          handleSetPropName(board[player.index].name);
          setOpenBid(true);
        }
      })
    }
    else if (board[player.index].owned === true) {
      if (board[player.index].owner.name !== player.name) {
        if (board[player.index].type === "Utilities") {
          var rent = 0;
          if (board[28].owner.name === board[12].owner.name) {
            rent = 10 * (die1 + die2);  
            addToHistory("pay " + board[player.index].owner.name + " $" + rent);
            payRent(player, rent);
          }
          else {
            rent = 4 * (die1 + die2);
            addToHistory("pay " + board[player.index].owner.name + " $" + rent);
            payRent(player, rent);
          }
        }
        //=============================
        else if (board[player.index].type === "Railroad") {
          let rent = railroadRent(player);
          payRent(player, rent);
        }
        //=============================
        else {
          var rent = 0;
          if (board[player.index].house === 1)
            rent = board[player.index].rentHouse1;
          else if (board[player.index].house === 2)
            rent = board[player.index].rentHouse2;
          else if (board[player.index].house === 3)
            rent = board[player.index].rentHouse3;
          else if (board[player.index].house === 4)
            rent = board[player.index].rentHouse4;
          else if (board[player.index].house === 5)
            rent = board[player.index].rentHotel;
          else {
            if (monopolyRent(player.index) === true) {
              rent = 2 * board[player.index].rentNormal
            } else {
              rent = board[player.index].rentNormal
            }
          }

          addToHistory("pay " + board[player.index].owner.name + " $" + rent);
          payRent(player, rent);
        }
      }
    }
    resolve("done");
  })
  
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

  return [rollEvent, payJail];
}

export default useGame;