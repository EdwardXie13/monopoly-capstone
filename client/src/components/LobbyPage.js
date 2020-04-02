import React, { useState, useLayoutEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

import '../styles/LobbyPage.css';
import '../styles/RoomPage.css';
import board from '../library/board/board';
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
import Deeds from '../classes/Deeds';
import Home from './Home'
import TradeSync from './TradeSync';
import Bid from '../components/Bid';

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
import FlyingChicken from '../assets/sprites/149/149_left.gif';
import OnionFrog from '../assets/sprites/003/003_left.gif';
import CrawlingMonkey from '../assets/sprites/059/059_left.gif';
import BigHeadedSnake from '../assets/sprites/150/150_left.gif';
import 'react-dice-complete/dist/react-dice-complete.css'
import Dice from '../components/Dice';
import Trade from './GamePage';
import TradeSyncContext from '../contexts/TradeSyncContext';

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
  const [gamers, setGamers] = useState({});
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
  const [highestBid, setHighestBid] = useState({ amount: -Infinity, player: { name: '' } });
  const [utilityDice, setUtilityDice] = useState(false);
  const [activator, setActivator] = useState(null);
  const [loanShark, setLoanShark] = useState({ name: '' });
  const [initialRent, setInitialRent] = useState(0);
  // const [finishedPlayer, setFinishedPlayer] = useState({ name: "" });
  const finishedPlayer = useRef({ name: '' });
  // const [isRolled, setIsRolled] = useState(false);
  
  const { players, code } = useContext(RoomContext);
  const { showManage, setShowManage, openBuild, setOpenBuild, rent, setRent, resolvePayment, setResolvePayment } = useContext(SellingContext);
  const { reactDice, isRolled, setIsRolled, double, setDouble, setReactDice } = useContext(ReactDiceContext);
  const { theirStuff, setTheirStuff, myStuff, setMyStuff, selected, setSelected, /*modalIsOpen, setIsOpen, */trader, setTrader, myStuffMoney, setMyStuffMoney, leftTrades, setLeftTrades, rightSelect, setRightSelect, rightValue, setRightValue, rightTrades, setRightTrades, isConfirm, setIsConfirm } = useContext(TradeSyncContext);
  const { openBid, setOpenBid, name, setName } = useContext(BiddingContext);
  const [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me, handleOpenTrade, handleMyStuffMoneyChange, handleLeftTradesChange, handleSelectorChange, handleRightValueChange, handleRightTradesChange, handleConfirm, handleYes, handleNextTurn, handleDeclineBidding, handleAcceptBidding, handleDiceRoll, handleBuyProp, handleSyncRoll, handlePlayerChange, handleSetPropName, handleOpenBuildWindow, handleSetActivator, handleSetFinishedPlayer, handleDisownInventory, handlePieceMove] = usePubNub(setIsPlaying, setIsWaiting, gamers, setGamers, setOpenTrade, setTrader, setMyStuffMoney, setLeftTrades, setRightSelect, setRightValue, setRightTrades, setIsConfirm, turnIdx, setTurnIdx, setBiddingTurnIdx, setOpenBid, setHighestBid, setReactDice, setIsOpen, setMyStuff, setTheirStuff, setName, setRent, setOpenBuild, setActivator, finishedPlayer, setLoanShark);


  const [history, renderHistory, addToHistory] = useCard();
  const [rollEvent, payJail] = useGame(addToHistory, setOpenBid, setName, handleBuyProp, handlePlayerChange, reactDice, setUtilityDice, handleSetPropName, gamers, me, setShowManage, setOpenBuild, setRent, setResolvePayment, handleOpenBuildWindow, handleSetActivator, finishedPlayer, handleSetFinishedPlayer, setInitialRent, handlePieceMove);
  const [width, height] = useWindowSize();
  // console.log("turn", Object.keys(gamers)[turnIdx]);
  // console.log("isRolled", isRolled);
  // console.log("double", me.current? gamers[me.current].doubles : null);

  // console.log("turn", Object.keys(gamers)[turnIdx]);
  // console.log(Object.keys(gamers)[turnIdx] === me.current, me.current !== null, me.current? gamers[me.current].bankrupt === true : null)
  if (Object.keys(gamers)[turnIdx] === me.current && me.current && gamers[me.current].bankrupt === true && isRolled) {
    handleNextTurn(); 
    setIsRolled(false);
  };

  const showThumbnail = src => {
    if(!src){
        return <img src={Default} style={{ position: "relative", height:window.innerHeight/2.5}}/>
    }
    return <img src={src} style={{ position: "relative", height:window.innerHeight/2.5}}/>
    // style={{ position: "absolute", top:"2px",left: "5px", width:"17.5%" }} 
  }

  const renderHome = () => (
    <div>
      <Home handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}></Home>
      {/* <div style={{ textAlign: "center" }}>
        <h3 style={{ color: "#64b5f6", textShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}><Link to="/">Monopoly</Link></h3>
        <button className="btn blue lighten-3" onClick={handleCreateRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Create Room</button>
        <button className="btn blue lighten-3" onClick={handleJoinRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Join Room</button>
      </div> */}
    </div>
  );

  const getCurrentPlayer = () => gamers[Object.keys(gamers)[turnIdx]];

  const renderPlayers = () => {
    return players.map(player => {
        return (
            <span>
                <img className="player-avatar" src="https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png" />
                <div className="player-name">{player.email}</div>
            </span>
        );  
    });
}

  const renderRoom = () => (
    <div className="room-container">
        <div className="white-layer">
            <div className="room-title">Room: {code}</div>
            { renderPlayers() }
        </div>
    </div>
);

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
              </form>
            </div>
          </div>
        </div>

        <div id="board-container" style={{position: "relative", display:"inline-block",width: "auto", height: window.innerHeight, top:"5px",left: "5px" }}>
          <img src={boardImage} style={{zIndex:"2",width: "auto", height: "937px", marginBottom: "0px"}} />
          <img src={FlyingChicken} className="sprite-0" style={{ position: "absolute", width: "32px", height: "32px", top: "840px", left: "835px" }} />
          <img src={OnionFrog} className="sprite-1" style={{ position: "absolute", width: "32px", height: "32px", top: "840px", left: "870px" }} />
          <img src={CrawlingMonkey} className="sprite-2" style={{ position: "absolute", width: "32px", height: "32px", top: "870px", left: "835px" }} />
          <img src={BigHeadedSnake} className="sprite-3" style={{ position: "absolute", width: "32px", height: "32px", top: "870px", left: "870px" }} />
          <div style={{position:"absolute", zIndex:"0",width:"60%",height:"30%",left:"20%",top:"40%"}}>
            <div style={{position:"absolute",top:"25%",left:"23%",zIndex:"3"}}>
              <Dice utilityDice={utilityDice} setUtilityDice={setUtilityDice} rollEvent={rollEvent} turnIdx={turnIdx} gamers={gamers} handleDiceRoll={handleDiceRoll} handleSyncRoll={handleSyncRoll} me={me} ></Dice>
            </div>
                  
            <div style={{position:"absolute",top:"48%",left:"0%"}}>
              {/* <div class="waves-effect waves-light btn-large" onClick={() => { tradeWindow() }}>Trade</div> */}
              <TradeButton setLeftTrades={setLeftTrades} setRightTrades={setRightTrades} theirStuff={theirStuff} setTheirStuff={setTheirStuff} myStuff={myStuff} setMyStuff={setMyStuff} selected={selected} setSelected={setSelected} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} me={me} gamers={gamers} handleOpenTrade={handleOpenTrade} handleMyStuffMoneyChange={handleMyStuffMoneyChange} handleLeftTradesChange={handleLeftTradesChange} handleSelectorChange={handleSelectorChange} handleRightValueChange={handleRightValueChange} handleRightTradesChange={handleRightTradesChange} handleConfirm={handleConfirm} />
              <TradeSync setLeftTrades={setLeftTrades} setRightTrades={setRightTrades} setTheirStuff={setTheirStuff} setMyStuff={setMyStuff} setSelected={setSelected} handleOpenTrade={handleOpenTrade} handleLeftTradesChange={handleLeftTradesChange} handleRightTradesChange={handleRightTradesChange} setIsConfirm={setIsConfirm} openTrade={openTrade} trader={trader} gamers={gamers} myStuffMoney={myStuffMoney} leftTrades={leftTrades} handleMyStuffMoneyChange={handleMyStuffMoneyChange} handleRightValueChange={handleRightValueChange} handleSelectorChange={handleSelectorChange} rightSelect={rightSelect} rightValue={rightValue} rightTrades={rightTrades} isConfirm={isConfirm} handleYes={handleYes} />
              <Bid me={me} player={getCurrentPlayer()} openBid={openBid} setOpenBid={setOpenBid} handleDeclineBidding={handleDeclineBidding} handleAcceptBidding={handleAcceptBidding} highestBid={highestBid} />
            </div>
              <div style={{position:"absolute",top:"48%",right:"0%"}}>
                <BuildButton setIsRolled={setIsRolled} handleDisownInventory={handleDisownInventory} setInitialRent={setInitialRent} initialRent={initialRent} loanShark={loanShark} gamers={gamers} handleSetFinishedPlayer={handleSetFinishedPlayer} activator={activator} setActivator={setActivator} handlePlayerChange={handlePlayerChange} resolvePayment={resolvePayment} setRent={setRent} rent={rent} openBuild={openBuild} setOpenBuild={setOpenBuild} showManage={showManage} setShowManage={setShowManage} player={gamers[me.current]} />
                {/* <div class="waves-effect waves-light btn-large" onClick={() => { buildWindow() }}>Build</div> */}
              </div>

              <div style={{position:"absolute",backgroundColor:"gray",left:"25%",bottom:"5%"}}>
                {/* <div class="waves-effect waves-light btn-large" onClick={() => { rollEvent(player1) }}>Roll Dice</div> */}
                <div class="waves-effect waves-light btn-large" onClick={async () => {
                  await payJail(gamers[me.current]);
                  await setIsRolled(true); 
                  reactDice.rollAll([5,5]);
                  }} disabled={ gamers[me.current].bankrupt || (Object.keys(gamers)[turnIdx] !== me.current) || (isRolled && /*gamers[me.current].doubles*/ double === 0) } >Roll Dice</div>
                {/* <div class="waves-effect waves-light btn-large" onClick={() => { console.log(reactDice.diceContainer.dice[0].state) }}>Roll Dice</div> */}
              </div>
            <div style={{position:"absolute",backgroundColor:"gray",right:"25%",bottom:"5%"}}>
              <a class="waves-effect waves-light btn-large end-button"  onClick={() => { handleNextTurn(); setIsRolled(false); }} disabled={!isRolled} > End Turn </a>
            </div>
          </div>
          
          <div id="AtlanticAvenue" onMouseEnter={() => setImageSource(AtlanticAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="BandORailroad" onMouseEnter={() => setImageSource(BandORailroad)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="BalticAvenue" onMouseEnter={() => setImageSource(BalticAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="Boardwalk" onMouseEnter={() => setImageSource(Boardwalk)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="ConnecticutAvenue" onMouseEnter={() => setImageSource(ConnecticutAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="ElectricCompany" onMouseEnter={() => setImageSource(ElectricCompany)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="IllinoisAvenue" onMouseEnter={() => setImageSource(IllinoisAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="IndianaAvenue" onMouseEnter={() => setImageSource(IndianaAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="KentuckyAvenue" onMouseEnter={() => setImageSource(KentuckyAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="MarvinGardens" onMouseEnter={() => setImageSource(MarvinGardens)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="MediterraneanAvenue" onMouseEnter={() => setImageSource(MediterraneanAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="NewYorkAvenue" onMouseEnter={() => setImageSource(NewYorkAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="NorthCarolinaAvenue" onMouseEnter={() => setImageSource(NorthCarolinaAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="OrientalAvenue" onMouseEnter={() => setImageSource(OrientalAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="PacificAvenue" onMouseEnter={() => setImageSource(PacificAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="ParkPlace" onMouseEnter={() => setImageSource(ParkPlace)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="PennsylvaniaAvenue" onMouseEnter={() => setImageSource(PennsylvaniaAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="PennsylvaniaRailroad" onMouseEnter={() => setImageSource(PennsylvaniaRailroad)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="ReadingRailroad" onMouseEnter={() => setImageSource(ReadingRailroad)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="ShortLineRailroad" onMouseEnter={() => setImageSource(ShortLineRailroad)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="StCharlesPlace" onMouseEnter={() => setImageSource(StCharlesPlace)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="StJamesPlace" onMouseEnter={() => setImageSource(StJamesPlace)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="StatesAvenue" onMouseEnter={() => setImageSource(StatesAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="TennesseeAvenue" onMouseEnter={() => setImageSource(TennesseeAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="VentnorAvenue" onMouseEnter={() => setImageSource(VentnorAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="VermontAvenue" onMouseEnter={() => setImageSource(VermontAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="VirginiaAvenue" onMouseEnter={() => setImageSource(VirginiaAvenue)} onMouseLeave={() => setImageSource('')}></div> 
          <div id="WaterWorks" onMouseEnter={() => setImageSource(WaterWorks)} onMouseLeave={() => setImageSource('')}></div> 
        </div>
        <Card renderHistory={renderHistory} style={{ position: "absolute",  height:"50%"}}></Card>
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