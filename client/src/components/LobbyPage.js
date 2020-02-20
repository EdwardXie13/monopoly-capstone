import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/LobbyPage.css';
import usePubNub from '../hooks/useLobby';
import boardImage from '../assets/boards/Classic.jpeg';
import useGame from '../hooks/useGame';
//import GamePage from '../components/GamePage';
import Player from '../classes/Player';

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

import { useLayoutEffect} from 'react';
import Card from './Card'

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}


const Lobby = () => {
  const [player, setPlayer] = useState(new Player("Player 1", "Go", 0));
  //const [player, setPlayer] = useState(new Player("Player 1", "Go", 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me] = usePubNub(setIsPlaying);
  
  const[rollEvent] = useGame();
  const [width, height] = useWindowSize();
  const showThumbnail = src => {
    if(!src){
        return <img src={Default} style={{ position: "relative", height:window.innerHeight/2.5}}/>
    }
    return <img src={src} style={{ position: "relative", height:window.innerHeight/2.5}}/>
    // style={{ position: "absolute", top:"2px",left: "5px", width:"17.5%" }} 
  }

  return (
    <div style={{  minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", margin: "0" }}>
      {
        !isPlaying? (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "#64b5f6", textShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}><Link to="/">Monopoly Beta</Link></h3>
            <button className="btn blue lighten-3" onClick={handleCreateRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Create Room</button>
            <button className="btn blue lighten-3" onClick={handleJoinRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Join Room</button>
          </div>
        ): ( 
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
                <img alt="Cannot load board." src={boardImage} style={{zIndex:"10",width: "auto", height: window.innerHeight, marginBottom: "0px"}} />
                <div style={{position:"absolute", zIndex:"100",backgroundColor:"gray",width:"16%",left:"42%",bottom:"25%"}}>
                  <a class="waves-effect waves-light btn-large" STYLE={{}} onClick={() => rollEvent(player)}>   Roll Dice   </a>
                </div>
                <div style={{position:"absolute", zIndex:"100",backgroundColor:"gray",width:"16%",left:"42%",top:"18%"}}>
                  <a class="waves-effect waves-light btn-large" STYLE={{}}>   End Turn   asdasj </a>
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
              <Card style={{ position: "relative",  height:"50%"}}></Card>
            </div>
            <div class="row"> </div>
          </div>
        )    
      }
    </div>
  );
};

export default Lobby;