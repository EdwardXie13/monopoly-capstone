import React, { useState, useLayoutEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

import '../styles/LobbyPage.css';
import '../styles/RoomPage.css';
import board from '../library/board/board';
import sprites from '../library/sprites/sprites';
import chanceCards from '../library/cards/Chance_Cards';
import communityCards from '../library/cards/Community_Chest_Cards';
import backend from '../apis/backend';
import usePubNub from '../hooks/usePubNub';
import ReactDiceContext from '../contexts/ReactDiceContext';
import RoomContext from '../contexts/RoomContext';
import BiddingContext from '../contexts/BiddingContext';
import SellingContext from '../contexts/SellingContext';
import boardImage from '../assets/boards/Classic copy.jpeg';
import useGame from '../hooks/useGame';
import useCard from '../hooks/useCard';
import Player from '../classes/Player';
import Card from './Card'
import BuildButton from './BuildButton';
import TradeButton from './TradeButton';
import Home from './Home'
import TradeSync from './TradeSync';
import Bid from '../components/Bid';
import SpriteButton from './SpriteButton';
import Swal from 'sweetalert2'

import Default from '../assets/cards/Default.png';
import AtlanticAvenue from '../assets/cards/Atlantic Avenue.png';
import BandORailroad from '../assets/cards/B and O Railroad.png';
import BalticAvenue from '../assets/cards/Baltic Avenue.png';
import Boardwalk from '../assets/cards/Boardwalk.png';
import ConnecticutAvenue from '../assets/cards/Connecticut Avenue.png';
import ElectricCompany from '../assets/cards/Electric Company.png';
import IllinoisAvenue from '../assets/cards/Illinois Avenue.png';
import IndianaAvenue from '../assets/cards/Indiana Avenue.png';
import KentuckyAvenue from '../assets/cards/Kentucky Avenue.png';
import MarvinGardens from '../assets/cards/Marvin Gardens.png';
import MediterraneanAvenue from '../assets/cards/Mediterranean Avenue.png';
import NewYorkAvenue from '../assets/cards/New York Avenue.png';
import NorthCarolinaAvenue from '../assets/cards/North Carolina Avenue.png';
import OrientalAvenue from '../assets/cards/Oriental Avenue.png';
import PacificAvenue from '../assets/cards/Pacific Avenue.png';
import ParkPlace from '../assets/cards/Park Place.png';
import PennsylvaniaAvenue from '../assets/cards/Pennsylvania Avenue.png';
import PennsylvaniaRailroad from '../assets/cards/Pennsylvania Railroad.png';
import ReadingRailroad from '../assets/cards/Reading Railroad.png';
import ShortLineRailroad from '../assets/cards/Short Line Railroad.png';
import StCharlesPlace from '../assets/cards/St Charles Place.png';
import StJamesPlace from '../assets/cards/St James Place.png';
import StatesAvenue from '../assets/cards/States Avenue.png';
import TennesseeAvenue from '../assets/cards/Tennessee Avenue.png';
import VentnorAvenue from '../assets/cards/Ventnor Avenue.png';
import VermontAvenue from '../assets/cards/Vermont Avenue.png';
import VirginiaAvenue from '../assets/cards/Virginia Avenue.png';
import WaterWorks from '../assets/cards/Water Works.png';

import 'react-dice-complete/dist/react-dice-complete.css'
import Dice from '../components/Dice';

import TradeSyncContext from '../contexts/TradeSyncContext';
import house from '../assets/boards/house.png';
import hotel from '../assets/boards/hotel.png';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  // useLayoutEffect(() => {
  //   function updateSize() {
  //     setSize([window.innerWidth, window.innerHeight]);
  //   }
  //   window.addEventListener('resize', updateSize);
  //   updateSize();
  //   return () => window.removeEventListener('resize', updateSize);
  // }, []);
  return size;
}

const Lobby = () => {
  const homeRef = useRef();
  // console.log("Home Ref is ", homeRef)
  const [gamers, setGamers] = useState({});
  console.log(gamers);
  const [player1, setPlayer1] = useState(new Player("Player 1"));
  const [player2, setPlayer2] = useState(new Player("Player 2"));
  // const [player3, setPlayer3] = useState(new Player("Player 3"));
  // const [player4, setPlayer4] = useState(new Player("Player 4"));
  const [openTrade, setOpenTrade] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [turnIdx, setTurnIdx] = useState(0);
  const [biddingTurnIdx, setBiddingTurnIdx] = useState(turnIdx);
  const [highestBid, setHighestBid] = useState({ amount: -1, player: { name: '' } });
  const [utilityDice, setUtilityDice] = useState(false);
  const [activator, setActivator] = useState(null);
  const [loanShark, setLoanShark] = useState({ name: '' });
  const [initialRent, setInitialRent] = useState(0);
  const [openSprite, setOpenSprite] = useState(false);
  // const [rooms, setRooms] = useState([]);
  // const [finishedPlayer, setFinishedPlayer] = useState({ name: "" });
  const finishedPlayer = useRef({ name: '' });
  // const [isRolled, setIsRolled] = useState(false);

  const { players, code, roomName } = useContext(RoomContext);
  const [history, setHistory] = useState(["history1", "history2", "history3", "history4", "history5"]);

  // const { rooms, setRooms } = useContext(HomeContext);
  const { showManage, setShowManage, openBuild, setOpenBuild, rent, setRent, resolvePayment, setResolvePayment } = useContext(SellingContext);
  const { reactDice, isRolled, setIsRolled, double, setDouble, setReactDice } = useContext(ReactDiceContext);
  const { theirStuff, setTheirStuff, myStuff, setMyStuff, selected, setSelected, /*modalIsOpen, setIsOpen, */trader, setTrader, myStuffMoney, setMyStuffMoney, leftTrades, setLeftTrades, rightSelect, setRightSelect, rightValue, setRightValue, rightTrades, setRightTrades, isConfirm, setIsConfirm } = useContext(TradeSyncContext);
  const { openBid, setOpenBid, name, setName } = useContext(BiddingContext);
  const [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me, handleOpenTrade, handleMyStuffMoneyChange, handleLeftTradesChange, handleSelectorChange, handleRightValueChange, handleRightTradesChange, handleConfirm, handleYes, handleNextTurn, handleDeclineBidding, handleAcceptBidding, handleDiceRoll, handleBuyProp, handleSyncRoll, handlePlayerChange, handleSetPropName, handleOpenBuildWindow, handleSetActivator, handleSetFinishedPlayer, handleDisownInventory, handlePieceMove, 
    handleLeaveRoom, handleStartGame, handleCommunityChestUpdate, handleChanceUpdate, handleSpriteSelect, handleFetchPlayers, handleOpenSpriteWindow, handleLoadGame, handleDisplayCard,
    handlePushHistory] = usePubNub(setIsPlaying, setIsWaiting, gamers, setGamers, setOpenTrade, setTrader, setMyStuffMoney, setLeftTrades, setRightSelect, setRightValue, setRightTrades, setIsConfirm, turnIdx, setTurnIdx, setBiddingTurnIdx, setOpenBid, setHighestBid, setReactDice, setIsOpen, setMyStuff, setTheirStuff, setName, setRent, setOpenBuild, setActivator, finishedPlayer, setLoanShark, homeRef, setOpenSprite, setHistory);

  const [renderHistory, addToHistory] = useCard(handlePushHistory, history, setHistory);

  const [rollEvent, payJail] = useGame(addToHistory, setOpenBid, setName, handleBuyProp, handlePlayerChange, reactDice, setUtilityDice, handleSetPropName, gamers, me, setShowManage, setOpenBuild, setRent, setResolvePayment, handleOpenBuildWindow, handleSetActivator, finishedPlayer, handleSetFinishedPlayer, setInitialRent, handlePieceMove, handleCommunityChestUpdate, handleChanceUpdate, handleDisplayCard);
  const [width, height] = useWindowSize();

  // Re-fetch rooms from database.
  const handleFetchRooms = () => {
    // pubnub.subscribe({
    //   channels: ["lobby"],
    //   withPresence: true
    // });
    //
    // backend.get('/room/')
    //   .then(res => {
    //     setRooms(res.data);
    //   });
  }

  // Handle bankrupted player's turn.
  if (Object.keys(gamers)[turnIdx] === me.current && me.current && gamers[me.current].bankrupt === true && isRolled) {
    handleNextTurn();
    setIsRolled(false);
  };

  const showThumbnail = src => {
    if(!src){
        return <img src={Default} style={{ position: "relative", height:window.innerHeight/2.5}}/>
    }
    return <img src={src} style={{ position: "relative", height:window.innerHeight/2.5}}/>
  }

  const renderHome = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Home myRef={homeRef} pubnub={pubnub} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}></Home>
    </div>
  );

  const getCurrentPlayer = () => gamers[Object.keys(gamers)[biddingTurnIdx]];

  const renderPlayers = () => {
    return players.map(player => {
        return (
            <span>
                {/* <img className="player-avatar" src="https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png" /> */}
                <div className="player-name">Player: {player.email}</div>
                <div>{player.ready? "READY" : "NOT READY"}</div>
            </span>
        );
    });
  }

  const getReadyStatus = () => {
    const meRef = players? players.find(p => p.email === me.current) : null;
    return meRef? meRef.ready : false;
  }

  console.log("check disable", (Object.keys(gamers)[turnIdx] !== me.current))

  const handleReady = () => {
    backend.put('/room/update', { ready: !getReadyStatus(), roomId: code })
      .then(res => {
        console.log("updated room", res.data);
        handleFetchPlayers();
      });
  }

  const everyOneReady = () => {
    return players.length > 1 && players.every(p => p.ready === true);
  }

  const renderRoom = () => (
    <div className="room-container">
        <div className="white-layer">
            <div className="room-title">Room: {code}</div>
            { renderPlayers() }
            <SpriteButton style={players[0].email !== me.current? {display: "none"} : null} disabled={!everyOneReady()} setGamers={setGamers} me={me} gamers={gamers} handleSpriteSelect={handleSpriteSelect} openSprite={openSprite} setOpenSprite={setOpenSprite} handleOpenSpriteWindow={handleOpenSpriteWindow}>
              {players[0].email === me.current && <button className="btn" onClick={() => handleStartGame()} disabled={Object.values(gamers).some(gamer => !gamer.spriteSrc.srcUp.length)}>Start Game</button> }
            </SpriteButton>
            <button className="btn" onClick={handleReady}>{getReadyStatus()? "Unready" : "Ready"}</button>
            <button className="btn" onClick={() => handleLeaveRoom(roomName)}>Leave</button>
            <button className="btn" onClick={() => {
              Swal.fire({
                title: 'Enter save code',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Load',
                showLoaderOnConfirm: true,
                preConfirm: (login) => {
                  return fetch(`/api/save/${login}`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(response.statusText)
                      }
                      return response.json()
                    })
                    .catch(error => {
                      Swal.showValidationMessage(
                        `Request failed: ${error}`
                      )
                    })
                },
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                if (result.value) {
                  console.log("loading game now...")
                  handleLoadGame(result.value);
                }
              })
            }} style={{ display: Object.keys(gamers)[0] !== me.current? "none": "inline-block" }}>Load</button>
        </div>
    </div>
);

const onSaveGame = () => {
  for (let key in gamers) {
    // gamers[key].spriteSrc.srcUp = '';
    // gamers[key].spriteSrc.srcDown = '';
    // gamers[key].spriteSrc.srcRight = '';
    for (let i = 0; i < sprites.length; ++i) {
      if (sprites[i].srcDown === gamers[key].spriteSrc.srcDown) {
        gamers[key].spriteSrc = i;
      }
    }
  }
  backend.post('/save', { roomCode: roomId.current, gamers: JSON.stringify(gamers), chanceCards: chanceCards, communityCards: communityCards, turnIdx: turnIdx, board: board })
    .then(() => console.log('meowwwwww'))
    .catch(() => console.log('wooooooooff'));
}

const countHouse = deedName => {
  for (let key in gamers) {
    for (let deed of gamers[key].inventory) {
      if (deedName === deed.name) return deed.house;
    }
  }

  return 0;
}

const renderHouse = (count, flexDirection, deedName) => {
  return count === 5? (
    <div  style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection, height: "inherit" }}>{<img src={hotel} style={{ width: "30px", height: "auto" }} />}</div>
  ) : (
    count > 0 &&
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection, height: "inherit" }}>
      <div><img src={house} style={{ width: "25px", height: "auto" }} /></div>
      <div style = {{fontWeight: "900"}}>x{count}</div>
    </div>
  )
}

  const renderGame = () => (
    <div className="row" style={{ width: "inherit" }}>
      <div className="col s12" style={{ display: "flex", flexDirection: "row"}}>
        <div style={{ position: "relative", height: "100%", top:"5px", right: "2px" }} >
          { showThumbnail(imageSource) }
          <div style={{textAlign: "center",display:"inline-block",backgroundColor:"gray",  width:"100%", height:window.innerHeight/1.74, padding:"15px", marginTop:"10px"}}>
            <div class="chat-popup" id="myForm">
              <form action="/action_page.php" class="form-container">
                <h1>Chat</h1>
                <label for="msg"><b>Message</b></label>
                <textarea placeholder="Type message.." name="msg" required></textarea>
                <button type="button" class="btn">Send</button>
                <button onClick={onSaveGame}>Save</button>
              </form>
            </div>
          </div>
        </div>

        <div id="board-container" style={{position: "relative", display:"inline-block",width: "auto", height: "937px", top:"5px",left: "5px" }}>
          <img src={boardImage} style={{zIndex:"2",width: "auto", height: "937px", marginBottom: "0px"}} />
          <img src={Object.values(gamers)[0].spriteSrc.srcUp} className="sprite-0" style={{ position: "absolute", width: "32px", height: "32px", top: "840px", left: "835px" }} />
          <img src={ Object.values(gamers)[1].spriteSrc.srcUp} className="sprite-1" style={{ position: "absolute", width: "32px", height: "32px", top: "840px", left: "870px" }} />
          {Object.keys(gamers).length > 2 && <img src={Object.values(gamers)[2].spriteSrc.srcUp} className="sprite-2" style={{ position: "absolute", width: "32px", height: "32px", top: "870px", left: "835px" }} />}
          {Object.keys(gamers).length > 3 && <img src={Object.values(gamers)[3].spriteSrc.srcUp} className="sprite-3" style={{ position: "absolute", width: "32px", height: "32px", top: "870px", left: "870px" }} />}
          <div style={{position:"absolute", zIndex:"0",width:"60%",height:"30%",left:"20%",top:"40%"}}>
            <div style={{position:"absolute",top:"25%",left:"23%",zIndex:"3"}}>
              <Dice utilityDice={utilityDice} setUtilityDice={setUtilityDice} rollEvent={rollEvent} turnIdx={turnIdx} gamers={gamers} handleDiceRoll={handleDiceRoll} handleSyncRoll={handleSyncRoll} me={me} ></Dice>
            </div>

            <div style={{position:"absolute",top:"48%",left:"0%"}}>
              <TradeButton disabled={ gamers[me.current].bankrupt || (Object.keys(gamers)[turnIdx] !== me.current) } setLeftTrades={setLeftTrades} setRightTrades={setRightTrades} theirStuff={theirStuff} setTheirStuff={setTheirStuff} myStuff={myStuff} setMyStuff={setMyStuff} selected={selected} setSelected={setSelected} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} me={me} gamers={gamers} handleOpenTrade={handleOpenTrade} handleMyStuffMoneyChange={handleMyStuffMoneyChange} handleLeftTradesChange={handleLeftTradesChange} handleSelectorChange={handleSelectorChange} handleRightValueChange={handleRightValueChange} handleRightTradesChange={handleRightTradesChange} handleConfirm={handleConfirm} />
              <TradeSync setLeftTrades={setLeftTrades} setRightTrades={setRightTrades} setTheirStuff={setTheirStuff} setMyStuff={setMyStuff} setSelected={setSelected} handleOpenTrade={handleOpenTrade} handleLeftTradesChange={handleLeftTradesChange} handleRightTradesChange={handleRightTradesChange} setIsConfirm={setIsConfirm} openTrade={openTrade} trader={trader} gamers={gamers} myStuffMoney={myStuffMoney} leftTrades={leftTrades} handleMyStuffMoneyChange={handleMyStuffMoneyChange} handleRightValueChange={handleRightValueChange} handleSelectorChange={handleSelectorChange} rightSelect={rightSelect} rightValue={rightValue} rightTrades={rightTrades} isConfirm={isConfirm} handleYes={handleYes} />
              <Bid me={me} player={getCurrentPlayer()} openBid={openBid} setOpenBid={setOpenBid} handleDeclineBidding={handleDeclineBidding} handleAcceptBidding={handleAcceptBidding} highestBid={highestBid} />
            </div>
              <div style={{position:"absolute",top:"48%",right:"0%"}}>
                <BuildButton disabled={ gamers[me.current].bankrupt || (Object.keys(gamers)[turnIdx] !== me.current) } setIsRolled={setIsRolled} handleDisownInventory={handleDisownInventory} setInitialRent={setInitialRent} initialRent={initialRent} loanShark={loanShark} gamers={gamers} handleSetFinishedPlayer={handleSetFinishedPlayer} activator={activator} setActivator={setActivator} handlePlayerChange={handlePlayerChange} resolvePayment={resolvePayment} setRent={setRent} rent={rent} openBuild={openBuild} setOpenBuild={setOpenBuild} showManage={showManage} setShowManage={setShowManage} player={gamers[me.current]} disabled={ gamers[me.current].bankrupt || (Object.keys(gamers)[turnIdx] !== me.current)}/>
                {/* <div class="waves-effect waves-light btn-large" onClick={() => { buildWindow() }}>Build</div> */}
              </div>

              <div style={{position:"absolute",backgroundColor:"gray",left:"25%",bottom:"5%"}}>
                {/* <div class="waves-effect waves-light btn-large" onClick={() => { rollEvent(player1) }}>Roll Dice</div> */}
                <div class="waves-effect waves-light btn-large" onClick={async () => {
                  await payJail(gamers[me.current]);
                  await setIsRolled(true);
                  reactDice.rollAll();
                  }} disabled={ gamers[me.current].bankrupt || (Object.keys(gamers)[turnIdx] !== me.current) || (isRolled && /*gamers[me.current].doubles*/ double === 0) } >Roll Dice</div>
                {/* <div class="waves-effect waves-light btn-large" onClick={() => { console.log(reactDice.diceContainer.dice[0].state) }}>Roll Dice</div> */}
              </div>
            <div style={{position:"absolute",backgroundColor:"gray",right:"25%",bottom:"5%"}}>
              <a class="waves-effect waves-light btn-large end-button"  onClick={() => { handleNextTurn(); setIsRolled(false); console.log("end turn")}} disabled={!isRolled} > End Turn </a>
            </div>
          </div>

          <div id="AtlanticAvenue" onMouseEnter={() => setImageSource(AtlanticAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Top-Tile">
              {renderHouse(countHouse("Atlantic Avenue"))}
            </div>
          </div>
          <div id="BandORailroad" onMouseEnter={() => setImageSource(BandORailroad)} onMouseLeave={() => setImageSource('')}></div>
          <div id="BalticAvenue" onMouseEnter={() => setImageSource(BalticAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Bottom-Tile">
              {renderHouse(countHouse("Baltic Avenue"))}
            </div>
          </div>
          <div id="Boardwalk" onMouseEnter={() => setImageSource(Boardwalk)} onMouseLeave={() => setImageSource('')}>
            <div className = "Right-Tile">
              {renderHouse(countHouse("Boardwalk"), "column")}
            </div>
          </div>
          <div id="ConnecticutAvenue" onMouseEnter={() => setImageSource(ConnecticutAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Bottom-Tile">
              {renderHouse(countHouse("Connecticut Avenue"))}
            </div>
          </div>
          <div id="ElectricCompany" onMouseEnter={() => setImageSource(ElectricCompany)} onMouseLeave={() => setImageSource('')}></div>
          <div id="IllinoisAvenue" onMouseEnter={() => setImageSource(IllinoisAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Top-Tile">
              {renderHouse(countHouse("Illinois Avenue"))}
            </div>
          </div>
          <div id="IndianaAvenue" onMouseEnter={() => setImageSource(IndianaAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Top-Tile">
              {renderHouse(countHouse("Indiana Avenue"))}
            </div>
          </div>
          <div id="KentuckyAvenue" onMouseEnter={() => setImageSource(KentuckyAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Top-Tile">
              {renderHouse(countHouse("Kentucky Avenue"))}
            </div>
          </div>
          <div id="MarvinGardens" onMouseEnter={() => setImageSource(MarvinGardens)} onMouseLeave={() => setImageSource('')}>
            <div className = "Top-Tile">
              {renderHouse(countHouse("Marvin Gardens"))}
            </div>
          </div>
          <div id="MediterraneanAvenue" onMouseEnter={() => setImageSource(MediterraneanAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Bottom-Tile">
              {renderHouse(countHouse("Mediterranean Avenue"))}
            </div>
          </div>
          <div id="NewYorkAvenue" onMouseEnter={() => setImageSource(NewYorkAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Left-Tile">
              {renderHouse(countHouse("New York Avenue"), "column")}
            </div>
          </div>
          <div id="NorthCarolinaAvenue" onMouseEnter={() => setImageSource(NorthCarolinaAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Right-Tile">
              {renderHouse(countHouse("North Carolina Avenue"), "column")}
            </div>
          </div>
          <div id="OrientalAvenue" onMouseEnter={() => setImageSource(OrientalAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Bottom-Tile">
              {renderHouse(countHouse("Oriental Avenue"))}
            </div>
          </div>
          <div id="PacificAvenue" onMouseEnter={() => setImageSource(PacificAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Right-Tile">
              {renderHouse(countHouse("Pacific Avenue"), "column")}
            </div>
          </div>
          <div id="ParkPlace" onMouseEnter={() => setImageSource(ParkPlace)} onMouseLeave={() => setImageSource('')}>
            <div className = "Right-Tile">
              {renderHouse(countHouse("Park Place"), "column")}
            </div>
          </div>
          <div id="PennsylvaniaAvenue" onMouseEnter={() => setImageSource(PennsylvaniaAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Right-Tile">
              {renderHouse(countHouse("Pennsylvania Avenue"), "column")}
            </div>
          </div>
          <div id="PennsylvaniaRailroad" onMouseEnter={() => setImageSource(PennsylvaniaRailroad)} onMouseLeave={() => setImageSource('')}></div>
          <div id="ReadingRailroad" onMouseEnter={() => setImageSource(ReadingRailroad)} onMouseLeave={() => setImageSource('')}></div>
          <div id="ShortLineRailroad" onMouseEnter={() => setImageSource(ShortLineRailroad)} onMouseLeave={() => setImageSource('')}></div>
          <div id="StCharlesPlace" onMouseEnter={() => setImageSource(StCharlesPlace)} onMouseLeave={() => setImageSource('')}>
            <div className = "Left-Tile">
              {renderHouse(countHouse("St. Charles Place"), "column")}
            </div>
          </div>
          <div id="StJamesPlace" onMouseEnter={() => setImageSource(StJamesPlace)} onMouseLeave={() => setImageSource('')}>
            <div className = "Left-Tile">
              {renderHouse(countHouse("St. James Place"), "column")}
            </div>
          </div>
          <div id="StatesAvenue" onMouseEnter={() => setImageSource(StatesAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Left-Tile">
              {renderHouse(countHouse("States Avenue"), "column")}
            </div>
          </div>
          <div id="TennesseeAvenue" onMouseEnter={() => setImageSource(TennesseeAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Left-Tile">
              {renderHouse(countHouse("Tennessee Avenue"), "column")}
            </div>
          </div>
          <div id="VentnorAvenue" onMouseEnter={() => setImageSource(VentnorAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Top-Tile">
              {renderHouse(countHouse("Ventnor Avenue"))}
            </div>
          </div>
          <div id="VermontAvenue" onMouseEnter={() => setImageSource(VermontAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Bottom-Tile">
              {renderHouse(countHouse("Vermont Avenue"))}
            </div>
          </div>
          <div id="VirginiaAvenue" onMouseEnter={() => setImageSource(VirginiaAvenue)} onMouseLeave={() => setImageSource('')}>
            <div className = "Left-Tile">
              {renderHouse(countHouse("Virginia Avenue"), "column")}
            </div>
          </div>
          <div id="WaterWorks" onMouseEnter={() => setImageSource(WaterWorks)} onMouseLeave={() => setImageSource('')}></div>
        </div>
        <Card gamers={gamers} renderHistory={renderHistory} style={{ position: "absolute",  height:"50%"}}></Card>
      </div>
      <div class="row"> </div>
    </div>
  );

  const conditionalRender = () => {
    if (!isPlaying && !isWaiting) return renderHome();
    else if (!isPlaying) return renderRoom();
    else return renderGame();
  }

  return (
    <div style={{  minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", margin: "0" }}>
      {
        conditionalRender()
        // renderGame()
      }
    </div>
  );
};

export default Lobby;
