import { useRef, useEffect, useContext } from 'react';
import PubNub from 'pubnub';
import Swal from "sweetalert2";
import Player from '../classes/Player';
import shortid  from 'shortid';
import Deeds from '../classes/Deeds';
import board from '../library/board/board';

import RoomContext from '../contexts/RoomContext';
import backend from '../apis/backend';

const usePubNub = (setIsPlaying, setIsWaiting, gamers, setGamers, setOpenTrade, setTrader, setMyStuffMoney, setLeftTrades, setRightSelect, setRightValue, setRightTrades, setIsConfirm, turnIdx, setTurnIdx, setBiddingTurnIdx, setOpenBid, setHighestBid) => {
  const lobbyChannel = useRef(null);
  const gameChannel = useRef(null);
  const roomId = useRef(null);
  const turnCounter = useRef(1);
  const me = useRef('');
  const { players, setPlayers, setCode } = useContext(RoomContext);

  const pubnub = new PubNub({
    publishKey: "pub-c-d1c0326e-1d91-434d-a115-8a73c59e3381",
    subscribeKey: "sub-c-bf23c8b4-5bf8-11ea-9a59-eab2515ceb0d"
  });

  useEffect(() => {
    pubnub.addListener({
      status: function(statusEvent) { },
      message: function(msg) {
        if (msg.message.text === "Game Started") {
          setIsPlaying(true);
          gameChannel.current = 'game--' + roomId.current;
          pubnub.subscribe({ 
            channels: [gameChannel.current],
            withPresence: true,
            error: error => {
              Swal.fire({
                position: 'center',
                allowOutsideClick: false,
                title: 'Error',
                text: JSON.stringify(error),
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
          });
          Swal.close();
        } else if (msg.message.text === "Player Joined") {
          // Update players state with msg.message.players.
          setPlayers(msg.message.players);
          
          const currentPlayer = new Player(msg.message.players[msg.message.players.length-1].email);

          setGamers(prevGamers => { return { ...prevGamers, [msg.message.players[msg.message.players.length-1].email]: currentPlayer } });
          
        } else if (msg.message.text === "Opened Trade") {
          setTrader(msg.message.player);
          if (msg.message.player !== me.current) { setOpenTrade(true); setLeftTrades(msg.message.checkedStuff); }
        } else if (msg.message.text === "My Stuff Money") {
          if (msg.message.player !== me.current) setMyStuffMoney(msg.message.money);
        } else if (msg.message.text === "Left Trades Change") {
          if (msg.message.player !== me.current) setLeftTrades(msg.message.checkedStuff);
        } else if (msg.message.text === "Selector Change") {
          if (msg.message.player !== me.current) setRightSelect(msg.message.selected);
        } else if (msg.message.text === "Right Value Change") {
          if (msg.message.player !== me.current) setRightValue(msg.message.money);
        } else if (msg.message.text === "Right Trades Change") {
          if (msg.message.player !== me.current) setRightTrades(msg.message.checkedStuff);
        } else if (msg.message.text === "Confirm clicked") {
          if (msg.message.player !== me.current && me.current === msg.message.candidate) setIsConfirm(true);
        } else if (msg.message.text === "Swap Inven") {
          setGamers(prevGamers => {
            let p1Inven = prevGamers[msg.message.p1].inventory.filter(item => !new Set([...msg.message.t1]).has(item.name));
            msg.message.t2.forEach(item => { 
              const tile = board.filter(t => t.name === item )[0];
              console.log("tile", tile);
              p1Inven.push(new Deeds(tile.name, tile.type, tile.index, tile.color, getRent(tile), tile.src, tile.buildingCost, tile.house ));
            });
            let p2Inven = prevGamers[msg.message.p2].inventory.filter(item => !new Set([...msg.message.t2]).has(item.name));
            msg.message.t1.forEach(item => {
              const tile = board.filter(t => t.name === item )[0];
              p2Inven.push(new Deeds(tile.name, tile.type, tile.index, tile.color, getRent(tile), tile.src, tile.buildingCost, tile.house ))
            });

            setLeftTrades(new Set());
            setRightTrades(new Set());
              
            return { ...prevGamers, [msg.message.p1]: { ...prevGamers[msg.message.p1], inventory: p1Inven }, [msg.message.p2]: { ...prevGamers[msg.message.p2], inventory: p2Inven } };
          });
        } else if (msg.message.text === "Next Turn") {
          setGamers(prevGamers => {
            setTurnIdx(prevIdx => {
              setBiddingTurnIdx((prevIdx + 1) % Object.keys(prevGamers).length);

              return (prevIdx + 1) % Object.keys(prevGamers).length
            });
            return prevGamers;
          })
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

            // while (!pg[Object.keys(pg)[newBidIdx]].bidding) {
              // newBidIdx = (newBidIdx + 1) % Object.entries(pg).length
            // }
            console.log("checking equal", me.current, phb.player.name);

            if (me.current !== phb.player.name && me.current === Object.keys(pg)[newBidIdx]) setOpenBid(true);

            newMe = pg[me.current];
            if (me.current === phb.player.name) {
              console.log("previous inventory", newMe.inventory);
              newMe = { ...newMe, inventory: [ ...newMe.inventory, msg.message.propName ] }
              biddingEnded = true;
            }

            return newBidIdx;
          });

          if (biddingEnded) {
            // setGamers(prevGamers => { return { ...prevGamers, [me.current]: newMe } });
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

              if (me.current !== phb.player.name && me.current === Object.keys(pg)[newBidIdx]) setOpenBid(true);

              return newBidIdx;
            })

            setHighestBid(prevHighestBid => { return { amount: msg.message.newBid, player: pg[msg.message.playerName] } });
          }
          meow();
        } else if (msg.message.text === "Bidding Ended") {
          setGamers(prevGamers => { return { ...prevGamers, [msg.message.newMe.name]: msg.message.newMe } });
        }
      }
    });

    return () => {
      pubnub.unsubscribeAll();
    }
  }, []);

  const getRent = tile => {
    if (!tile.house) return tile.rentNormal;

    let house = 'rentHouse';

    return tile.house > 4? tile.rentHotel : tile[house+tile.house];
  }

  const joinRoom = value => {
    roomId.current = value;
    lobbyChannel.current = 'lobby--' + roomId.current;
    
    pubnub.hereNow({
      channels: [lobbyChannel.current]
    }).then(response => {
      if (response.totalOccupancy < 4) {
        pubnub.subscribe({
          channels: [lobbyChannel.current],
          withPresence: true,
          error: error => {
            Swal.fire({
              position: 'center',
              allowOutsideClick: false,
              title: 'Error',
              text: JSON.stringify(error),
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

        backend.put('/room/join', { roomId: roomId.current })
          .then(res => {
            setCode(roomId.current);
            setPlayers(res.data.players);
            setIsWaiting(true);

            pubnub.publish({ channel: lobbyChannel.current, message: { text: "Player Joined", players: res.data.players } });
            me.current = res.data.players[res.data.players.length-1].email;
            
            let existingPlayers = {};

            for (let p of res.data.players) {
              existingPlayers[p.email] = new Player(p.email);
            }

            const currentPlayer = new Player(me.current);

            setGamers({ ...existingPlayers, [me.current]: currentPlayer });

            if (response.totalOccupancy ===1) {
              pubnub.publish({ channel: lobbyChannel.current, message: { text: "Game Started" } });
              gameChannel.current = 'game--' + roomId.current;
              pubnub.subscribe({ channels: [gameChannel.current], withPresence: true });
              setIsPlaying(true);
            }
          });
      } else {
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

  const handleOpenTrade = checkedStuff => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Opened Trade", player: me.current, checkedStuff: checkedStuff } });
  }

  const handleCreateRoom = () => {
    roomId.current = shortid.generate().substring(0,5);
    lobbyChannel.current = 'lobby--' + roomId.current;

    pubnub.subscribe({
      channels: [lobbyChannel.current],
      withPresence: true,
      error: error => {
        Swal.fire({
          position: 'center',
          allowOutsideClick: false,
          title: 'Error',
          text: JSON.stringify(error),
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
    });

    backend.post('/room/create', { roomId: roomId.current })
      .then(res => {
        setPlayers(res.data.players);
        setCode(roomId.current);
        setIsWaiting(true);

        me.current = res.data.players[0].email;
        
        const currentPlayer = new Player(me.current);

        setGamers({ ...gamers, [me.current]: currentPlayer });
      });
  }

  const handleJoinRoom = () => {
    Swal.fire({
      title: "Join a Game Lobby",
      position: 'center',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter the room id',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 500,
      // padding: '0.7em',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class ',
        cancelButton: 'join-button-class'
      } 
    }).then(result => {
      if(result.value){
        joinRoom(result.value);
      }
    });
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

  const handleYes = (p1, p2, t1, t2) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Swap Inven", p1, p2, t1: [...t1], t2: [...t2] } });
  }

  const handleNextTurn = () => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Next Turn" } });
  }

  const handleDeclineBidding = (player, propName) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Decline Bidding", player: player.name, propName } });
  }

  const handleAcceptBidding = (newBid, playerName) => {
    pubnub.publish({ channel: gameChannel.current, message: { text: "Accept Bidding", newBid, playerName } });
  }

  return [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me, handleOpenTrade, handleMyStuffMoneyChange, handleLeftTradesChange, handleSelectorChange, handleRightValueChange, handleRightTradesChange, handleConfirm, handleYes, handleNextTurn, handleDeclineBidding, handleAcceptBidding];
}

export default usePubNub;