import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const TradeSync = props => {
  const [modalIsOpen, setIsOpen] = useState(props.openTrade);

  useEffect(() => {
    setIsOpen(props.openTrade);
  }, [props.openTrade, props.leftTrades, props.rightSelect, props.rightValue, props.isConfirm, props.rightTrades, props.myStuffMoney, props.gamers]);

  const closeModal = () => { 
    setIsOpen(false);
    
  };

  const renderContent = () => {
      return props.trader.length > 0 && (
        <>
          <div className="col s6">
            <div style={{ height: "45px" }}>{props.trader}</div>
            <div>{props.gamers[props.trader].name}'s money: {props.gamers[props.trader].money}</div>
            <input type="number" placeholder="$" value={props.myStuffMoney} />
            <div className="left-trades">{renderCheckBoxes(props.gamers[props.trader].inventory)}</div>
          </div>
          <div className="col s6">
            <select className="browser-default" value={props.rightSelect}>
              { renderOptions() }
            </select>
            { props.rightSelect !== null && props.gamers[props.rightSelect] && <div>{props.gamers[props.rightSelect].name}'s money: {props.gamers[props.rightSelect].money}</div> }
            { props.rightSelect !== null && props.gamers[props.rightSelect] && <input type="number" placeholder="$" value={props.rightValue} />}
            { props.rightSelect !== null && props.gamers[props.rightSelect] && renderCheckBoxes(props.gamers[props.rightSelect].inventory) }
          </div>
        </>
    )
  }

  const renderOptions = () => {
    const options = [<option value="">Select a player</option>];

    for (let key in props.gamers) {
      if (props.trader !== key) options.push(<option value={key}>{key}</option>)
    }

    return options;
  }

  const renderCheckBoxes = inventory => {
    const isMyInven = JSON.stringify(inventory) === JSON.stringify(props.gamers[props.trader].inventory);

    let myInv=[];

    for (let i = 0; i < inventory.length; ++i) {
      myInv.push(
          <label>
            <input type="checkbox" name={inventory[i].name} checked={ isMyInven? new Set([ ...props.leftTrades ]).has(inventory[i].name) : new Set([ ...props.rightTrades ]).has(inventory[i].name) } />
            <span style = {{display:"block"}} className="prop-span">
              <img className="card-styling" style={{backgroundColor: inventory[i].color}}/>
              <h className="inv-text-styling"> {inventory[i].name} </h>
            </span>
          </label>
      )
    }
    
    return myInv;
  }

  const handleYes = () => {
    // console.log("from handleYes", props.leftTrades, props.rightTrades);
    props.setIsConfirm(false);
    // props.setIsOpen(false);
    console.log("leftTrades", props.leftTrades, "rightTrades", props.rightTrades);
    props.handleYes(props.trader, props.rightSelect, new Set([ ...props.leftTrades ]), new Set([ ...props.rightTrades ]), props.trader, props.myStuffMoney, props.rightSelect, props.rightValue );
    props.handleOpenTrade([], false);
    props.setMyStuff({ money: 0, properties: new Set([]) });
    props.setTheirStuff({ money: 0, properties: new Set([]) });
    props.setLeftTrades(new Set([]));
    props.setRightTrades(new Set([]));
    props.handleMyStuffMoneyChange(0);
    props.handleRightValueChange(0);
    props.handleSelectorChange("Select a player");
    props.setSelected(null);
  }

  const renderConfirmDialog = () => {
    return props.isConfirm && (
      <>
        <div>{props.trader} has offered this trade, do you accept?</div>
        <button className="btn" onClick={handleYes}>YES</button>
        <button className="btn">NO</button>
      </>
    );
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      shouldCloseOnOverlayClick={false}
      onRequestClose={closeModal}
      contentLabel="OwO"
    >
    <div className="trade-container">
      <h1 style = {{display:"flex", justifyContent:"center", fontSize:"2rem"}}>{props.trader}'s Trade Window </h1>
      <div className="row">
        { renderContent() }
      </div>
      <div className="row center">
        { renderConfirmDialog() }
      </div>
    </div>
    </Modal>
  );
}

export default TradeSync;