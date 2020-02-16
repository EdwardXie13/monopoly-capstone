import React, { useState } from 'react';

import TradingCard from './TradingCard';

const Trading = props => {
  const [cards, setCards] = useState(props.cards);

  return (
    <div style={{ display: "flex", flexDirection: props.flexDirection }}>
      {
        cards.length > 0 && cards.map((card, index) => {
          return card.location === 'Trade' && <TradingCard 
            width={props.width}
            setSelectedCardLocation={props.setSelectedCardLocation}
            setSelectedCardIndex={props.setSelectedCardIndex}
            setZoomedCard={props.setZoomedCard}
            key={index}
            name={card.name}
            index={index}
            src={card.image}
            location={card.location}
            onInventoryToTrade={props.onInventoryToTrade}
            onTradeToInventory={props.onTradeToInventory}
            deg={props.deg}
            cards={cards}
            setCards={setCards}
          />;
        })
      }
      <div style={{ minWidth: props.width, maxWidth: props.width, height: props.height }}>
        {
          cards.length > 0 && cards.map((card, index) => {
            return card.location === 'Inventory' && <TradingCard 
              width={props.width}
              setSelectedCardLocation={props.setSelectedCardLocation}
              setSelectedCardIndex={props.setSelectedCardIndex}
              setZoomedCard={props.setZoomedCard}
              key={index}
              index={index}
              name={card.name}
              src={card.image}
              location={card.location}
              onInventoryToTrade={props.onInventoryToTrade}
              onTradeToInventory={props.onTradeToInventory}
              deg={props.deg}
              cards={cards}
              setCards={setCards}
            />;
          })
        }
      </div>
    </div>
  );
};

export default Trading;