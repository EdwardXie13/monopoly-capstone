import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import test from '../assets/sprites/006/006_down.gif';
import '../styles/BuildButton.css';

import AtlanticAvenue from '../assets/cards/Atlantic Avenue.png';
import BalticAvenue from '../assets/cards/Baltic Avenue.png';
import Boardwalk from '../assets/cards/Boardwalk.png';
import Blank from '../assets/cards/Blank.png';
import ConnecticutAvenue from '../assets/cards/Connecticut Avenue.png';
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
import StCharlesPlace from '../assets/cards/St Charles Place.png';
import StJamesPlace from '../assets/cards/St James Place.png';
import StatesAvenue from '../assets/cards/States Avenue.png';
import TennesseeAvenue from '../assets/cards/Tennessee Avenue.png';
import VentnorAvenue from '../assets/cards/Ventnor Avenue.png';
import VermontAvenue from '../assets/cards/Vermont Avenue.png';
import VirginiaAvenue from '../assets/cards/Virginia Avenue.png';
 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const BuildButton = props => {
  var subtitle;
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }
 
  function closeModal(){
    setIsOpen(false);
  }

  const confirmBuild = () => {
    console.log("Built")
  }
 
  return (
    <div>
      <button className='waves-effect waves-light btn-large' onClick={openModal}>Build</button>
      <Modal
        isOpen={modalIsOpen}
      //   onAfterOpen={afterOpenModal}
        
        onRequestClose={closeModal}
      //   style={customStyles}
        contentLabel="Example Modal"
      >
      <div className="row build-container">
        <div className= "inventory col s6">
          <img class={"card-style"} src={BalticAvenue}></img>
          <img class={"card-style"} src={MediterraneanAvenue}></img>
          <img class={"card-style"} src={Blank}></img>
          <img class={"card-style"} src={OrientalAvenue}></img>
          <img class={"card-style"} src={VermontAvenue}></img>
          <img class={"card-style"} src={ConnecticutAvenue}></img>
          <img class={"card-style"} src={StCharlesPlace}></img>
          <img class={"card-style"} src={StatesAvenue}></img>
          <img class={"card-style"} src={VirginiaAvenue}></img>
          <img class={"card-style"} src={StJamesPlace}></img>
          <img class={"card-style"} src={TennesseeAvenue}></img>
          <img class={"card-style"} src={NewYorkAvenue}></img>
          <img class={"card-style"} src={KentuckyAvenue}></img>
          <img class={"card-style"} src={IndianaAvenue}></img>
          <img class={"card-style"} src={IllinoisAvenue}></img>
          <img class={"card-style"} src={AtlanticAvenue}></img>
          <img class={"card-style"} src={VentnorAvenue}></img>
          <img class={"card-style"} src={MarvinGardens}></img>
          <img class={"card-style"} src={PacificAvenue}></img>
          <img class={"card-style"} src={NorthCarolinaAvenue}></img>
          <img class={"card-style"} src={PennsylvaniaAvenue}></img>
          <img class={"card-style"} src={ParkPlace}></img>
          <img class={"card-style"} src={Boardwalk}></img>
        </div>
        <div className= "right-side col s6">
          <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => confirmBuild() }> Confirm </button>
        </div>
      </div>
        
      </Modal>
    </div>
  );
}

export default BuildButton;