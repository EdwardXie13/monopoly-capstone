import { useRef, useEffect, useContext, useState } from 'react';
import PubNub from 'pubnub';
import Swal from "sweetalert2";
import Player from '../classes/Player';
import shortid  from 'shortid';
import Deeds from '../classes/Deeds';
import board from '../library/board/board';
import communityChest from '../library/cards/Community_Chest_Cards';
import chance from '../library/cards/Chance_Cards';
import sprites from '../library/sprites/sprites';

import RoomContext from '../contexts/RoomContext';
import backend from '../apis/backend';

const usePubNub = (setIsPlaying, setIsWaiting, gamers, setGamers, setOpenTrade, setTrader, setMyStuffMoney, setLeftTrades, setRightSelect, setRightValue, setRightTrades, setIsConfirm, turnIdx, setTurnIdx, setBiddingTurnIdx, setOpenBid, setHighestBid, setReactDice, setIsOpen, setMyStuff, setTheirStuff, setName, setRent, setOpenBuild, setActivator, finishedPlayer, setLoanShark, homeRef, setOpenSprite, setHistory) => {
  const lobbyChannel = useRef(null);
  const gameChannel = useRef(null);
  const roomId = useRef(null);
  const turnCounter = useRef(1);
  const me = useRef('');
  const { players, setPlayers, setCode, roomName, setRoomName } = useContext(RoomContext);

  const pubnub = new PubNub({
    publishKey: "pub-c-a872a814-ff46-40a2-813c-482cdcef049b"/*'pub-c-7045c7b8-54ee-4831-81e0-35058c0eabff'*/,
    subscribeKey: "sub-c-1564b086-71e2-11ea-895f-e20534093ea4"/*'sub-c-f28bdf0c-3db7-11ea-afe9-722fee0ed680'*/
  });

  useEffect(() => {
    pubnub.addListener({
      status: function(statusEvent) { },
      message: async function(msg) {
        if (msg.message.text === "Game Started") {
          setIsPlaying(true);
          gameChannel.current = 'game--' + roomId.current;
          pubnub.subscribe({
            channels: [gameChannel.current],
            withPresence: true
          });

          let seeds = [];

          for (let i = 0; i < 16; ++i) {
            seeds.push(Math.random());
          }

          pubnub.publish({ channel: gameChannel.current, message: { text: "Shuffle decks", seed: seeds } });
        } else if (msg.message.text === "Player Joined") {
          // Update players state with msg.message.players.
          setPlayers(msg.message.players);

          const currentPlayer = new Player(msg.message.players[msg.message.players.length-1].email);

          setGamers(prevGamers => {
            currentPlayer.sprite = `sprite-${Object.keys(prevGamers).length}`;
            return { ...prevGamers, [msg.message.players[msg.message.players.length-1].email]: currentPlayer }
          });

        } else if (msg.message.text === "Opened Trade") {
          setLeftTrades(new Set([]))
          setRightTrades(new Set([]));
          setTrader(msg.message.player);
          if (msg.message.player !== me.current) { setOpenTrade(msg.message.open); setLeftTrades(msg.message.checkedStuff); }
          if (!msg.message.open) { setOpenTrade(msg.message.open); setIsOpen(false); }
        } else if (msg.message.text === "My Stuff Money") {
          if (msg.message.player !== me.current) setMyStuffMoney(msg.message.money);
        } else if (msg.message.text === "Left Trades Change") {
          if (msg.message.player !== me.current) setLeftTrades(msg.message.checkedStuff);
        } else if (msg.message.text === "Selector Change") {
          /*if (msg.message.player !== me.current)*/ setRightSelect(msg.message.selected);
        } else if (msg.message.text === "Right Value Change") {
          if (msg.message.player !== me.current) setRightValue(msg.message.money);
        } else if (msg.message.text === "Right Trades Change") {
          if (msg.message.player !== me.current) setRightTrades(msg.message.checkedStuff);
        } else if (msg.message.text === "Confirm clicked") {
          if (msg.message.player !== me.current && me.current === msg.message.candidate) setIsConfirm(true);
        } else if (msg.message.text === "Swap Inven") {
          console.log(msg.message.t1, msg.message.t2);

          setGamers(prevGamers => {
            let p1Inven = prevGamers[msg.message.p1].inventory.filter(item => !new Set([...msg.message.t1]).has(item.name));
            msg.message.t2.forEach(item => {
              const tile = board.filter(t => t.name === item )[0];
              p1Inven.push(new Deeds(tile.name, tile.type, tile.index, tile.color, getRent(tile), tile.src, tile.buildingCost, tile.house ));
            });
            let p2Inven = prevGamers[msg.message.p2].inventory.filter(item => !new Set([...msg.message.t2]).has(item.name));
            msg.message.t1.forEach(item => {
              const tile = board.filter(t => t.name === item )[0];
              p2Inven.push(new Deeds(tile.name, tile.type, tile.index, tile.color, getRent(tile), tile.src, tile.buildingCost, tile.house ))
            });

            return { ...prevGamers, [msg.message.p1]: { ...prevGamers[msg.message.p1], inventory: p1Inven, money: prevGamers[msg.message.p1].money + parseInt(msg.message.rightValue) - parseInt(msg.message.myStuffMoney) }, [msg.message.p2]: { ...prevGamers[msg.message.p2], inventory: p2Inven, money: prevGamers[msg.message.p2].money + parseInt(msg.message.myStuffMoney) - parseInt(msg.message.rightValue) } };
          });

          setLeftTrades(new Set([]));
          setRightTrades(new Set([]));
          setMyStuff({ money: 0, properties: new Set([]) });
          setTheirStuff({ money: 0, properties: new Set([]) });
        } else if (msg.message.text === "Next Turn") {
          let pg = null;
          let pIdx = null;

          setGamers(prevGamers => {
            pg = prevGamers;
            return prevGamers;
          });

          setTurnIdx(prevIdx => {
            pIdx = prevIdx;
            return (prevIdx + 1) % Object.keys(pg).length;
          });

          setBiddingTurnIdx((pIdx + 1) % Object.keys(pg).length);
        } else if (msg.message.text === "Decline Bidding") {
          let pg = null;
          let phb = null;
          let biddingEnded = false;

          setGamers(prevGamers => {
            pg = prevGamers;
            return { ...prevGamers, [msg.message.player]: { ...prevGamers[msg.message.player], bidding: false } }
          });

          setHighestBid(prevHighestBid => {
            phb = prevHighestBid;
            return prevHighestBid;
          });

          let newMe = pg[me.current];
          setBiddingTurnIdx(prevBidIdx => {
            let newBidIdx = (prevBidIdx + 1) % Object.entries(pg).length;

            if (me.current !== phb.player.name && me.current === Object.keys(pg)[newBidIdx]) setOpenBid(true);

            newMe = pg[me.current];
            console.log("me", me.current, "previous highest", phb, "turn + 1: ", Object.keys(pg)[newBidIdx]);
            if (me.current === phb.player.name && Object.keys(pg)[newBidIdx] === me.current) {
              console.log("previous inventory", newMe.inventory);
              //name, type, index, color, rent, src, buildingCost, price, mortgage
              const tile = board.filter(t => t.name === msg.message.propName)[0];
              console.log("tile", tile);
              newMe = { ...newMe, money: newMe.money - msg.message.highestBidAmount, inventory: [ ...newMe.inventory, new Deeds(msg.message.propName, tile.type, tile.index, tile.color, tile.rentNormal, tile.src, tile.buildingCost, tile.price, false) ] }
              biddingEnded = true;
            }

            return newBidIdx;
          });

          if (biddingEnded) {
            // setGamers(prevGamers => { return { ...prevGamers, [me.current]: newMe } });
            console.log("newMe", newMe);
            console.log("propName", typeof msg.message.propName)
            pubnub.publish({ channel: gameChannel.current, message: { text: "Bidding Ended", newMe } });

          }

        } else if (msg.message.text === "Accept Bidding") {
          let pg = null;
          let phb = null;
          let nbi = null;


          const meow = async () => {
            await setGamers(prevGamers => {
              pg = prevGamers;
              return { ...prevGamers }
            });

            await setHighestBid(prevHighestBid => {
              phb = prevHighestBid;
              return prevHighestBid;
            });

            await setBiddingTurnIdx(prevBidIdx => {
              let newBidIdx = (prevBidIdx + 1) % Object.entries(pg).length;

              nbi = newBidIdx;

              // while (!pg[Object.keys(pg)[newBidIdx]].bidding) {
                // newBidIdx = (newBidIdx + 1) % Object.entries(pg).length
              // }
              // console.log(me.current, phb);

              return newBidIdx;
            })
            // console.log("new bidder", msg.message.newBid, pg[msg.message.playerName])
            setHighestBid(prevHighestBid => { 
              phb = { amount: msg.message.newBid, player: pg[msg.message.playerName] }; 
              return { amount: msg.message.newBid, player: pg[msg.message.playerName] } 
            });
            if (me.current !== phb.player.name && me.current === Object.keys(pg)[nbi]) setOpenBid(true);
          }
          meow();
        } else if (msg.message.text === "Bidding Ended") {
          let highestBidder = null;
          setGamers(prevGamers => { return { ...prevGamers, [msg.message.newMe.name]: msg.message.newMe } });
          
          setHighestBid(phb => {
            highestBidder = phb;
            return { amount: -1, player: { name: '' } }
          });

          setName(prevName => {
            board.forEach(tile => {
              if (tile.name === prevName) {
                tile.owned = true;
                tile.owner = highestBidder.player;
                console.log("from boom", highestBidder)
              }
            });
            
            return prevName;
          })
        } else if (msg.message.text === "Rolled Dice") {
          // console.log("new gamers", msg.message.newGamers)
          console.log("new board", msg.message.newBoard);
          for (let i = 0; i < board.length; ++i) {
            board[i] = msg.message.newBoard[i];
          }
          // board = msg.message.newBoard;
          // console.log(board)
          // board[0].type = "meow";
          // console.log("oldboard", board, "newboard", msg.message.newBoard);
          // setGamers(msg.message.newGamers);
        } else if (msg.message.text === "Set Owner") {
          board[msg.message.boardIdx].owned = true;
          board[msg.message.boardIdx].owner = msg.message.owner;
          const tile = board[msg.message.boardIdx];
          const price = tile.type !== "Tile"? tile.price : 0;

          setGamers(prevGamers => { 
            return {
              ...prevGamers, 
              [msg.message.owner.name]: { 
                ...prevGamers[msg.message.owner.name], 
                money: prevGamers[msg.message.owner.name].money - price, 
                location: board[msg.message.boardIdx].name, 
                inventory: [...prevGamers[msg.message.owner.name].inventory, 
                  new Deeds(tile.name, tile.type, tile.index, tile.color, tile.rentNormal, tile.src, tile.buildingCosts, tile.price, tile.mortgaged)] 
              } 
            } 
          })
        } else if (msg.message.text === "Sync Roll") {
          let rDice = null;

          setReactDice(prevReactDice => {
            rDice = prevReactDice;
            return prevReactDice;
          })
          if (msg.message.player !== me.current) rDice.rollAll([ msg.message.d1, msg.message.d2 ]);
        } else if (msg.message.text === "Change Player Stuff") {
          setGamers(prevGamers => {
            return { ...prevGamers, [msg.message.player]: { ...prevGamers[msg.message.player], money: msg.message.money, inventory: msg.message.inventory, index: msg.message.index, location: msg.message.location, bankrupt: msg.message.bankrupt } };
          });
        } else if (msg.message.text === "Set Prop Name") {
          setName(msg.message.propName);
        } else if (msg.message.text === "Open Build Window") {
          if (msg.message.player.name === me.current) {
            await setRent(msg.message.rent);
            await setLoanShark(msg.message.loanShark);
            await setOpenBuild(true);
            document.querySelector('.manage-button').click();
          }
        } else if (msg.message.text === "Set Activator") {
          setActivator(msg.message.player);
        } else if (msg.message.text === "Set Finished Player") {
          // console.log("finished player", msg.message.player);
          finishedPlayer.current = msg.message.player;
        } else if (msg.message.text === "Disown Inventory") {
          for (let deed of msg.message.inventory) {
            board[deed.index].owned = false;
            board[deed.index].owner = "Bank";
            board[deed.index].mortgaged = false;
          }
        } else if (msg.message.text === "Piece Move") {
          let player = msg.message.player;
          let currentIndex = msg.message.currentIndex === undefined? msg.message.player.index : msg.message.currentIndex;
          const destinationIndex = msg.message.destinationIndex;
          console.log("indices", currentIndex, destinationIndex)

          let playerOrder = -1;
          setPlayers(prevPlayers => {
            prevPlayers.forEach((p, i) => { if (p.email === player.name) {
              playerOrder = i;
              return;
            } });
            return prevPlayers;
          });

          if (destinationIndex === 30) {
            console.log("destination is Jail")
            if (playerOrder === 0) {
              document.querySelector(`.${player.sprite}`).style.top = "810px";
              document.querySelector(`.${player.sprite}`).style.left = "40px";
            } else if (playerOrder === 1) {
              document.querySelector(`.${player.sprite}`).style.top = "810px";
              document.querySelector(`.${player.sprite}`).style.left = "95px";
            } else if (playerOrder === 2) {
              document.querySelector(`.${player.sprite}`).style.top = "860px";
              document.querySelector(`.${player.sprite}`).style.left = "40px";
            } else if (playerOrder === 3) {
              document.querySelector(`.${player.sprite}`).style.top = "860px";
              document.querySelector(`.${player.sprite}`).style.left = "95px";
            }
          } else {
            for (; currentIndex !== destinationIndex; currentIndex = (currentIndex+1) % 40) {
              // Left 0-9
              // Up 10-19
              // Right 20-29
              // Down 30-39

              let top = document.querySelector(`.${player.sprite}`).style.top;
              let left = document.querySelector(`.${player.sprite}`).style.left;

              // document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
              // src = actual facing direction
              // down = down
              // up = left
              // left = right
              // right = up
              
              if (currentIndex === 0) {
                // document.querySelector(`.${player.sprite}`).style.top = `${parseInt(top.slice(0, top.length-2)) + 30 }px`;
                document.querySelector(`.${player.sprite}`).style.left = `${parseInt(left.slice(0, left.length-2)) - 95 }px`;
                document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcUp;
              } else if (currentIndex >= 1 && currentIndex <= 8) {
                document.querySelector(`.${player.sprite}`).style.left = `${parseInt(left.slice(0, left.length-2)) - 77 }px`;
                document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcUp;
              } else if (currentIndex === 9) { //index 9 go to 10
                if (playerOrder == 0) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 30 }px`*/"815px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 120 }px`*/"5px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 1) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) + 10 }px`*/"860px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 155 }px`*/"5px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 2) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) + 25 }px`*/"895px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 77 }px`*/"40px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 3) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) + 25 }px`*/"895px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 67 }px`*/"85px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                }
              } else if (currentIndex === 10 ) { //index 10 go to 11
                if (playerOrder == 0) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 83 }px`*/"735px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) + 65 }px`*/"65px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 1) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 83 }px`*/"775px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) + 65 }px`*/"65px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 2) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 125 }px`*/"735px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 40 }px`*/"10px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 3) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 125 }px`*/"775px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 80 }px`*/"10px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                }
              } else if (currentIndex >= 11 && currentIndex <= 18) {
                document.querySelector(`.${player.sprite}`).style.top = `${parseInt(top.slice(0, top.length-2)) - 76 }px`;
              } else if (currentIndex === 19) { //index 19 go to 20
                if (playerOrder == 0) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 60 }px`*/"65px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 1) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 100 }px`*/"65px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) - 39 }px`*/"30px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 2) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 150 }px`*/"15px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) + 60 }px`*/"65px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                } else if (playerOrder === 3) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 150 }px`*/"15px";
                  document.querySelector(`.${player.sprite}`).style.left = /*`${parseInt(left.slice(0, left.length-2)) + 20 }px`*/"30px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcRight;
                }
              } else if (currentIndex === 20) { //index 20 go to 21
                  if (playerOrder === 0 || playerOrder === 2) {
                    document.querySelector(`.${player.sprite}`).style.left = `${parseInt(left.slice(0, left.length-2)) + 100 }px`;
                    document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcleft;
                  } else if (playerOrder === 1 || playerOrder === 3) {
                    document.querySelector(`.${player.sprite}`).style.left = `${parseInt(left.slice(0, left.length-2)) + 105 }px`;
                    document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcleft;
                  }
              } else if (currentIndex >= 21 && currentIndex <= 28) {
                document.querySelector(`.${player.sprite}`).style.left = `${parseInt(left.slice(0, left.length-2)) + 75 }px`;
                document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcleft;
              } else if (currentIndex === 29) { //index 29 go to 30
                if (playerOrder == 0) {
                  document.querySelector(`.${player.sprite}`).style.left = /*` ${parseInt(left.slice(0, left.length-2)) + 55 }px`*/"835px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
                } else if (playerOrder == 1) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) - 39 }px`*/"15px";
                  document.querySelector(`.${player.sprite}`).style.left = /*` ${parseInt(left.slice(0, left.length-2)) + 100 }px`*/"835px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
                } else if (playerOrder == 2) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) + 50 }px`*/"65px";
                  document.querySelector(`.${player.sprite}`).style.left = /*` ${parseInt(left.slice(0, left.length-2)) + 100 }px`*/"880px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
                } else if (playerOrder == 3) {
                  document.querySelector(`.${player.sprite}`).style.top = /*`${parseInt(top.slice(0, top.length-2)) + 45 }px`*/"15px";
                  document.querySelector(`.${player.sprite}`).style.left = /*` ${parseInt(left.slice(0, left.length-2)) + 150 }px`*/"880px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
                }
              } else if (currentIndex === 30) { //index 30 go to 31
                if (playerOrder === 0 || playerOrder === 2) {
                  document.querySelector(`.${player.sprite}`).style.top = `${parseInt(top.slice(0, top.length-2)) + 100 }px`;
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
                } else if (playerOrder === 1 || playerOrder === 3) {
                  document.querySelector(`.${player.sprite}`).style.top = `${parseInt(top.slice(0, top.length-2)) + 115 }px`;
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
                }
              } else if (currentIndex >= 31 && currentIndex <= 38) {
                document.querySelector(`.${player.sprite}`).style.top = `${parseInt(top.slice(0, top.length-2)) + 75 }px`;
                document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcDown;
              } else if (currentIndex === 39) {
                if (playerOrder == 0) {
                  document.querySelector(`.${player.sprite}`).style.top = "840px";
                  document.querySelector(`.${player.sprite}`).style.left = "835px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcUp;
                } else if (playerOrder == 1) {
                  document.querySelector(`.${player.sprite}`).style.top = "840px";
                  document.querySelector(`.${player.sprite}`).style.left = "870px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcUp;
                } else if (playerOrder == 2) {
                  document.querySelector(`.${player.sprite}`).style.top = "870px";
                  document.querySelector(`.${player.sprite}`).style.left = "835px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcUp;
                } else if (playerOrder == 3) {
                  document.querySelector(`.${player.sprite}`).style.top = "870px";
                  document.querySelector(`.${player.sprite}`).style.left = "870px";
                  document.querySelector(`.${player.sprite}`).src = player.spriteSrc.srcUp;
                }
              }

              // end of for loop
            }
          }
        } else if (msg.message.text === "Fetch Rooms") {
          // console.log("Home Ref is", homeRef);
          homeRef.current();
        } else if (msg.message.text === "Player Leaved") {
          setPlayers(msg.message.players);

          const playerLeft = msg.message.playerLeft;

          setGamers(prevGamers => {
            let newGamers = { ...prevGamers };
            delete newGamers[playerLeft];
            console.log("playerLEft", playerLeft);
            console.log("new gamers", newGamers);
            let i = 0;

            for (let key in newGamers) {
              newGamers[key].sprite = `sprite-${i++}`;
            }
            console.log()
            return { ...newGamers };
          });
        } else if (msg.message.text === "Update Community Cards") {
          communityChest.unshift(communityChest.pop());
        } else if (msg.message.text === "Update Chance Cards") {
          chance.unshift(chance.pop());
        } else if (msg.message.text === "Selected Sprite") {
          const { newGamers, oldIdx, newIdx } = msg.message.data;
          setGamers(newGamers);
          sprites[oldIdx].picked = false;
          sprites[newIdx].picked = true;
        } else if (msg.message.text === "Fetch Players") {
          backend.get('/room/id', { params: { id: roomId.current } })
            .then(res => {
              console.log("new players", res.data[0].players);
              setPlayers(res.data[0].players);
            });
        } else if (msg.message.text === "Open Sprite Window") {
          console.log("Open Sprite Window")
          setOpenSprite(true);
        } else if (msg.message.text === "Load Game") {
          setIsPlaying(true);

          gameChannel.current = 'game--' + roomId.current;
          pubnub.subscribe({
            channels: [gameChannel.current],
            withPresence: true
          });

          const newGamers = JSON.parse(msg.message.data.gamers);
          
          for (let key in newGamers) {
            newGamers[key].spriteSrc = sprites[newGamers[key].spriteSrc];
          }

          setGamers(newGamers);

          setTurnIdx(msg.message.data.turnIdx);

          for (let i = 0; i < board.length; ++i) {
            board[i] = msg.message.data.board[i];
          }
          
          for (let i = 0; i < communityChest.length; ++i) {
            communityChest[i] = msg.message.data.communityCards[i];
          }

          for (let i = 0; i < chance.length; ++i) {
            chance[i] = msg.message.data.chanceCards[i];
          }

          let player = newGamers[me.current];


          pubnub.publish({ 
            channel: gameChannel.current, 
            message: { 
              text: "Piece Move", 
              player, 
              destinationIndex: newGamers[me.current].index, 
              direction: 'forward',
              currentIndex: 0
            }
          });
        } else if (msg.message.text === "Display Card") {
          const { src, ms } = msg.message;

          const imageNode = document.createElement('IMG');
          imageNode.setAttribute("src", src);
          imageNode.setAttribute("style", "position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)");
          document.querySelector('#board-container').appendChild(imageNode);

          setTimeout(() => {
            imageNode.remove();
          }, ms);
        } else if (msg.message.text === "Add history") {
          setHistory(prevHistory => {
            prevHistory.unshift(msg.message.data);
            if (prevHistory.length > 5) prevHistory.pop();

            return prevHistory;
          });
        } else if (msg.message.text === "Shuffle decks") {
          console.log("shuffling decks")
          console.log("seed", msg.message.seed);

          function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(msg.message.seed[i] * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
          }

          shuffle(chance);
          shuffle(communityChest);
          console.log(chance);
          console.log(communityChest);
          // chance.sort(() => msg.message.seed - 0.5)
          // communityChest.sort(() => msg.message.seed - 0.5)
        }
      }
    });

    window.addEventListener("beforeunload", e => {
      let rn = null;
      setRoomName(prevRoomName => rn = prevRoomName);
      handleLeaveRoom(rn);
      // Unsub to room.
    });

    return () => {
      // let rn = null;
      // setRoomName(prevRoomName => rn = prevRoomName);
      // handleLeaveRoom(rn);
      pubnub.unsubscribeAll();
    }
  }, []);

  const getRent = tile => {
    if (!tile.house) return tile.rentNormal;

    let house = 'rentHouse';

    return tile.house > 4? tile.rentHotel : tile[house+tile.house];
  }

  const handleStartGame = () => {
    pubnub.publish({ channel: lobbyChannel.current, message: { text: "Game Started" } });
    gameChannel.current = 'game--' + roomId.current;
    pubnub.subscribe({ channels: [gameChannel.current], withPresence: true });
    setIsPlaying(true);
  }

  const joinRoom = (value, roomName, password) => {
    roomId.current = value;
    lobbyChannel.current = 'lobby--' + roomId.current;
    setRoomName(roomName);

    pubnub.hereNow({
      channels: [lobbyChannel.current]
    }).then(response => {
      let pg = 0;
      setGamers(prevGamers => pg = prevGamers);

      if (response.totalOccupancy < 4) {
        pubnub.subscribe({
          channels: [lobbyChannel.current],
          withPresence: true
        });

        backend.put('/room/join', { /*roomId: roomId.current*/ roomName: roomName, password: password })
          .then(res => {
            setCode(roomId.current);
            setPlayers(res.data.players);
            setIsWaiting(true);

            pubnub.publish({ channel: lobbyChannel.current, message: { text: "Player Joined", players: res.data.players } });
            me.current = res.data.players[res.data.players.length-1].email;

            let existingPlayers = {};

            for (let i = 0; i < res.data.players.length; ++i) {
              const p = res.data.players[i];
              existingPlayers[p.email] = new Player(p.email);
              existingPlayers[p.email].sprite = `sprite-${i}`;
            }

            console.log("existing players", existingPlayers);
            setGamers({ ...existingPlayers });

            // if (res.data.players.length === 3) {
            //   pubnub.publish({ channel: lobbyChannel.current, message: { text: "Game Started" } });
            //   gameChannel.current = 'game--' + roomId.current;
            //   pubnub.subscribe({ channels: [gameChannel.current], withPresence: true });
            //   setIsPlaying(true);
            // }
          });
      } else {
        console.log("else");
        Swal.fire({
          position: 'center',
          allowOutsideClick: false,
          title: 'Error',
          text: 'Game in progress. Try another room.',
          width: 275,
          padding: '0.7em',
          customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
            confirmButton: 'button-class'
          }
        });
      }
    })
  }

  const handleOpenTrade = (checkedStuff, open) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Opened Trade", player: me.current, checkedStuff: checkedStuff, open } });
  }

  const handleCreateRoom = async form => {
    roomId.current = form.roomId;
    lobbyChannel.current =  'lobby--' + roomId.current;

    setRoomName(form.roomName);

    pubnub.subscribe({
      channels: [lobbyChannel.current],
      withPresence: true,
    });

    backend.post('/room/create', { ...form, roomId: roomId.current })
      .then(res => {
        setPlayers(res.data.players);
        setCode(roomId.current);
        setIsWaiting(true);

        me.current = res.data.players[0].email;

        const currentPlayer = new Player(me.current);

        currentPlayer.sprite = `sprite-0`;

        setGamers({ ...gamers, [me.current]: currentPlayer });

        handleFetchRooms();
      });
  }

  const handleJoinRoom = (roomId, roomName, password) => {
    // Swal.fire({
    //   title: "Join a Game Lobby",
    //   position: 'center',
    //   input: 'text',
    //   allowOutsideClick: false,
    //   inputPlaceholder: 'Enter the room id',
    //   showCancelButton: true,
    //   confirmButtonColor: 'rgb(208,33,41)',
    //   confirmButtonText: 'OK',
    //   width: 500,
    //   padding: '0.7em',
    //   customClass: {
    //     heightAuto: false,
    //     popup: 'popup-class',
    //     confirmButton: 'join-button-class ',
    //     cancelButton: 'join-button-class'
    //   }
    // }).then(result => {
    //   if(result.value){
    //     joinRoom(result.value);
    //   }
    // });
    joinRoom(roomId, roomName, password);
  }

  const handleMyStuffMoneyChange = money => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "My Stuff Money", player: me.current, money: money } });
  }

  const handleLeftTradesChange = checkedStuff => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Left Trades Change", player: me.current, checkedStuff: [...checkedStuff] } });
  }

  const handleRightTradesChange = checkedStuff => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Right Trades Change", player: me.current, checkedStuff: [...checkedStuff] } });
  }

  const handleSelectorChange = selected => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Selector Change", player: me.current, selected: selected } });
  }

  const handleRightValueChange = money => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Right Value Change", player: me.current, money: money } });
  }

  const handleConfirm = candidate => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Confirm clicked", player: me.current, candidate: candidate } });
  }

  const handleYes = (p1, p2, t1, t2, trader, myStuffMoney, rightSelect, rightValue) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Swap Inven", p1, p2, t1: [...t1], t2: [...t2], trader, myStuffMoney, rightSelect, rightValue } });
  }

  const handleNextTurn = () => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Next Turn" } });
  }

  const handleDeclineBidding = (player, propName, highestBidAmount) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Decline Bidding", player: player.name, propName, highestBidAmount } });
  }

  const handleAcceptBidding = (newBid, playerName) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Accept Bidding", newBid, playerName } });
  }

  const handleDiceRoll = (newBoard, newGamers) => {
    // console.log("new board", newBoard);
    pubnub.publish({ channel: gameChannel.current, message: { text: "Rolled Dice", newBoard, newGamers } });
  }

  const handleBuyProp = (boardIdx, owner) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Set Owner", boardIdx, owner } });
  }

  const handleSyncRoll = (d1, d2, player) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Sync Roll", d1, d2, player } });
  }

  const handlePlayerChange = (player, money, location, inventory, index, bankrupt = false) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Change Player Stuff", player, money, location, inventory, index, bankrupt } });
  }

  const handleSetPropName = propName => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Set Prop Name", propName } });
  }

  const handleOpenBuildWindow = (player, rent, loanShark) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Open Build Window", player, rent, loanShark } });
  }

  const handleSetActivator = player => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Set Activator", player } });
  }

  const handleSetFinishedPlayer = player => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Set Finished Player", player } });
  }

  const handleDisownInventory = inventory => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Disown Inventory", inventory } });
  }

  const handlePieceMove = (player, destinationIndex, direction = "forward") => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Piece Move", player, destinationIndex, direction } });
  }

  const handleFetchRooms = () => {
    pubnub.publish({ channel: "lobby", message: { text: "Fetch Rooms" } });
  }

  const handleLeaveRoom = roomName => {
    backend.put('/room/leave', { roomName: roomName, playerName: me.current })
      .then(res => {
        console.log('res', res);
        setIsWaiting(false);
        handleFetchRooms();
        pubnub.publish({ channel: lobbyChannel.current, message: { text: "Player Leaved", players: res.data.players, playerLeft: me.current } });
      });
  }

  const handleCommunityChestUpdate = () => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Update Community Cards" } });
  }

  const handleChanceUpdate = () => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Update Chance Cards" } });
  }

  const handleSpriteSelect = data => {
    pubnub.publish({ channel: lobbyChannel.current, message: { text: "Selected Sprite", data } });
  }

  const handleFetchPlayers = () => {
    pubnub.publish({ channel: lobbyChannel.current, message: { text: "Fetch Players" } });
  }

  const handleOpenSpriteWindow = () => {
    pubnub.publish({ channel: lobbyChannel.current, message: { text: "Open Sprite Window" } });
  }

  const handleLoadGame = data => {
    pubnub.publish({ channel: lobbyChannel.current, message: { text: "Load Game", data } });
  }

  const handleDisplayCard = (src, ms) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Display Card", src, ms } });
  }

  const handlePushHistory = data => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Add history", data } });
  }

  return [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me, handleOpenTrade, handleMyStuffMoneyChange, handleLeftTradesChange, handleSelectorChange, handleRightValueChange, handleRightTradesChange, handleConfirm, handleYes, handleNextTurn, handleDeclineBidding, handleAcceptBidding, handleDiceRoll, handleBuyProp, handleSyncRoll, handlePlayerChange, handleSetPropName, handleOpenBuildWindow, handleSetActivator, handleSetFinishedPlayer, handleDisownInventory, handlePieceMove, handleLeaveRoom, handleStartGame, handleCommunityChestUpdate, handleChanceUpdate, handleSpriteSelect, handleFetchPlayers, handleOpenSpriteWindow, handleLoadGame, handleDisplayCard, handlePushHistory];
}

export default usePubNub;
