import React from 'react';
import Modal from 'react-modal';
import '../styles/TradeButton.css';

import AtlanticAvenue from '../assets/cards/Atlantic Avenue.png';
import BandORailroad from '../assets/cards/B and O Railroad.png';
import BalticAvenue from '../assets/cards/Baltic Avenue.png';
import Blank from '../assets/cards/Blank.png';
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
 
const TradeButton = props => {
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
      <button className='waves-effect waves-light btn-large' onClick={openModal}>Trade</button>
      <Modal
        isOpen={modalIsOpen}
      //   onAfterOpen={afterOpenModal}
        
        onRequestClose={closeModal}
      //   style={customStyles}
        contentLabel="Example Modal"
      >
      <div className="row build-container">
        <div className= "inventory col s6">
        
        </div>
        <div className= "right-side col s6">
          <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => confirmBuild() }> Confirm Trade </button>
        </div>
      </div>
        
      </Modal>
    </div>
  );
}

export default TradeButton;