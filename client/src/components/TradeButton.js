import React from 'react';
import Modal from 'react-modal';
import '../styles/TradeButton.css';
import Deeds from '../classes/Deeds';

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
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const TradeButton = ({ me , gamers}) => {
  var subtitle;
  const [modalIsOpen,setIsOpen] = React.useState(false);
  const [myInventory, setMyInventory] = React.useState([]);
  const [otherInventory, setOtherInventory] = React.useState({});
  const [selected, setSelected] = React.useState(null);

  const [myStuff, setMyStuff] = React.useState({ money: 0, properties: new Set([]) });
  const [theirStuff, setTheirStuff] = React.useState({ money: 0, properties: new Set([]) });
  console.log(theirStuff);
  React.useEffect(() => { 
    if (!modalIsOpen) setOtherInventory({});
    spawnItems();
    setMyInventory(renderMyTrade(gamers[me.current].inventory));
  }, [modalIsOpen])

  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal(){
    setIsOpen(false);
  }

  const confirmTrade = () => {
    console.log("Trade confirmed")
  }

  const spawnItems = () => {
    gamers[me.current].inventory.push(new Deeds("MA", "property", 1, "Brown" , 2, MediterraneanAvenue, 50))
    gamers[me.current].inventory.push(new Deeds("BA", "property", 3, "Brown", 4, BalticAvenue, 50))
    gamers[me.current].inventory.push(new Deeds("OA", "property", 6, "LightBlue", 6, OrientalAvenue, 50))
    gamers[me.current].inventory.push(new Deeds("VA", "property", 8, "LightBlue", 6, VermontAvenue, 50))
    gamers[me.current].inventory.push(new Deeds("CA", "property", 9, "LightBlue", 8, ConnecticutAvenue, 50))
    gamers[me.current].inventory.push(new Deeds("SCP", "property", 11, "Pink", 10, StCharlesPlace, 100))

    // gamers["1@2.com"].inventory.push(new Deeds("MEWO1", "property", 11, "Pink", 10, StCharlesPlace, 100))
    // gamers["1@2.com"].inventory.push(new Deeds("MEWO2", "property", 11, "Pink", 10, StCharlesPlace, 100))
    // gamers["1@2.com"].inventory.push(new Deeds("MEWO3", "property", 11, "Pink", 10, StCharlesPlace, 100))
    // gamers["1@2.com"].inventory.push(new Deeds("MEWO4", "property", 11, "Pink", 10, StCharlesPlace, 100))
  }

  const renderMyTrade = inventory => {
    const isMyInven = JSON.stringify(inventory) === JSON.stringify(gamers[me.current].inventory);

    let myInv=[];
    for (let i = 0; i < inventory.length; ++i) {
      myInv.push(
          <label>
            <input type="checkbox" name={inventory[i].name} onChange={e => {
              const checked = e.target.checked;
              const name = e.target.name;
              if (isMyInven) {
                setMyStuff(prevStuff => { 
                  let myProps = new Set([...prevStuff.properties]);
                  checked? myProps.add(name) : myProps.delete(name);
                  return { ...prevStuff, properties: myProps };
                });
              } else {
                setTheirStuff(prevStuff => { 
                  let theirProps = new Set([...prevStuff.properties]);
                  checked? theirProps.add(name) : theirProps.delete(name);
                  return { ...theirStuff, properties: theirProps }
                });
              }
            }} />
            <span style = {{display:"block"}} className="prop-span">
              <img className="card-styling" style={{backgroundColor: inventory[i].color}}/>
              <h className="inv-text-styling"> {inventory[i].name} </h>
            </span>
          </label>
      )
    }
    // if (isMyInven) setMyInventory(myInv);
    return myInv;
  }

  const renderOptions = () => {
    const options = [<option value="">Select a player</option>];

    for (let key in gamers) {
      if (me.current !== key) options.push(<option value={key}>{key}</option>)
    }

    return options;
  }
 
  return (
    <div>
      <button className='waves-effect waves-light btn-large' onClick={openModal}>Trade</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
      <div className="trade-container">
      <h1 style = {{display:"flex", justifyContent:"center", fontSize:"2rem"}}> Trade </h1>
        <div className="row">
          <div className="col s6">
            <div style={{ height: "45px" }}>{me.current}</div>
            <div>My money: {gamers[me.current].money}</div>
            <input type="number" placeholder="$" value={myStuff.money} onChange={ e => setMyStuff({ ...myStuff, money: e.target.value }) } />
              { myInventory }
          </div>
          <div className="col s6">
            <select className="browser-default" onChange={ e => setSelected(e.target.value) }>
              { renderOptions() }
            </select>
            { selected !== null && <div>{gamers[selected].name}'s money: {gamers[selected].money}</div> }
            <input type="number" placeholder="$" value={theirStuff.money} onChange={ e => setTheirStuff({ ...theirStuff, money: e.target.value }) } />
            { selected !== null && renderMyTrade(gamers[selected].inventory) }
          </div>
        </div>
        <div className="row">
          
        </div>
      </div>
        
      </Modal>
    </div>
  );
}

export default TradeButton;