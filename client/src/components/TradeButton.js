import React from 'react';
import Modal from 'react-modal';
import '../styles/TradeButton.css';
import Deeds from '../classes/Deeds';
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const TradeButton = ({ disabled, setLeftTrades, setRightTrades, theirStuff, setTheirStuff, myStuff, setMyStuff, selected, setSelected, modalIsOpen, setIsOpen, me , gamers, handleOpenTrade, handleMyStuffMoneyChange, handleLeftTradesChange, handleSelectorChange, handleRightValueChange, handleRightTradesChange, handleConfirm }) => {
  var subtitle;
  // const [modalIsOpen,setIsOpen] = React.useState(false);
  const [myInventory, setMyInventory] = React.useState([]);
  const [otherInventory, setOtherInventory] = React.useState({});
  // const [selected, setSelected] = React.useState(null);
  // const [myStuff, setMyStuff] = React.useState({ money: 0, properties: new Set([]) });
  // const [theirStuff, setTheirStuff] = React.useState({ money: 0, properties: new Set([]) });
  React.useEffect(() => { 
    if (!modalIsOpen) setOtherInventory({});
    setMyInventory(renderMyTrade(gamers[me.current].inventory));
  }, [modalIsOpen, gamers, theirStuff, setTheirStuff, myStuff, setMyStuff, selected, setSelected])

  function openModal() {
    setLeftTrades(new Set([]))
    setRightTrades(new Set([]))
    setIsOpen(true);
    setSelected(null);
    setMyStuff({ money: 0, properties: new Set([]) });
    setTheirStuff({ money: 0, properties: new Set([]) });
    handleOpenTrade([...myStuff.properties], true);
  }
 
  function closeModal(){
    setIsOpen(false);
    setMyStuff({ money: 0, properties: new Set([]) });
    setTheirStuff({ money: 0, properties: new Set([]) });
    handleOpenTrade([...myStuff.properties], false);
    handleMyStuffMoneyChange(0);
    handleRightValueChange(0);
    handleSelectorChange("Select a player");
    setSelected(null);
  }

  const acceptTrade = () => {
    try {
      if (myStuff.money <= gamers[me.current].money && theirStuff.money <= gamers[selected].money) {
        handleConfirm(selected);
        console.log("Trade accepted")
      }
    }
    catch(error) {
      console.log('error')
    }
  }

  const declineTrade = () => {
    console.log("Trade declined")
    closeModal()
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
                  handleLeftTradesChange(new Set([ ...myProps ]));
                  return { ...prevStuff, properties: myProps };
                });
              } else {
                setTheirStuff(prevStuff => { 
                  let theirProps = new Set([...prevStuff.properties]);
                  checked? theirProps.add(name) : theirProps.delete(name);
                  handleRightTradesChange(new Set([ ...theirProps ]));
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
      <button className='waves-effect waves-light btn-large' disabled ={disabled} onClick={openModal}>Trade</button>
      <Modal
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick={false}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
      <div className="trade-container">
      <h1 style = {{display:"flex", justifyContent:"center", fontSize:"2rem"}}> Trade </h1>
        <div className="row">
          <div className="col s6">
            <div style={{ height: "45px" }}>{me.current}</div>
            <div>My money: {gamers[me.current].money}</div>
            <input type="number" placeholder="$" value={myStuff.money} onChange={ e => { setMyStuff({ ...myStuff, money: e.target.value }); handleMyStuffMoneyChange(e.target.value) } } />
            <div className="my-trades">
              { myInventory }
            </div>
          </div>
          <div className="col s6">
            <select className="browser-default" onChange={ e => { setSelected(e.target.value); handleSelectorChange(e.target.value); } }>
              { renderOptions() }
            </select>
            { selected !== null && gamers[selected] && <div>{gamers[selected].name}'s money: {gamers[selected].money}</div> }
            { selected !== null && gamers[selected] && <input type="number" placeholder="$" value={theirStuff.money} onChange={ e => { setTheirStuff({ ...theirStuff, money: e.target.value }); handleRightValueChange(e.target.value) } } /> }
            { selected !== null && gamers[selected] && renderMyTrade(gamers[selected].inventory) }
          </div>
        </div>
        <div className="row" style = {{display: "flex", justifyContent:"center"}}>
          <button className="btn blue lighten-3" id = "bottom-trade-button" onClick={ () => acceptTrade() } > Accept </button>
          <button className="btn blue lighten-3" id = "bottom-trade-button" onClick={ () => declineTrade() } > Cancel </button>
        </div>
      </div>
        
      </Modal>
    </div>
  );
}

export default TradeButton;