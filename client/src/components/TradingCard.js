import React, { useState } from 'react';

const TradingCard = props => {
  const [isSelected, setIsSelected] = useState(false);
  const width = parseInt(props.width.slice(0, 4), 10) / 5;

  const renderActions = () => {
    if (isSelected) {
      if (props.location === "Inventory") {
        return (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <button style={{ display: "block" }} onClick={() => {props.onInventoryToTrade(props.index); setIsSelected(!isSelected); }}>Offer up for Trade</button>
          </div>
        )
      }
      else if (props.location === "Trade") {
        return (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <button style={{ display: "block" }} onClick={() => {props.onTradeToInventory(props.index); setIsSelected(!isSelected); }}>Offer up for Trade</button>
          </div>
        )
      }
    } 
    return null;
  }

  const onClick = e => {
    // Change the current clicked card to Trade
    let newCards = [];
    for (let card of props.cards) {
      if (card.name === props.name) {
        card.location = 'Trade';
      }
      
      newCards.push(card);
    }

    props.setCards(newCards);
  }

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <img src={props.src} onClick={onClick} />
      {/* <img onMouseEnter={() => props.setZoomedCard(props.src)} onMouseLeave={() => props.setZoomedCard("")} alt="" className="card" src={props.src} onClick={onClick} style={{ width: width, height: "auto", margin: "0", transform: props.deg }} />  */}
      { renderActions() }
    </span>
  );
};

export default TradingCard;