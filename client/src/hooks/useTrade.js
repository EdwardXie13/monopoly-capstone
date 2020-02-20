import cards from '../library/cards/Title_Deeds_Cards';

const useTrade = () => {
  const onInventoryToTrade = index => {
    inventory[index].location = "Trade";
    setTrade([...trade, inventory[index]]);
    setInventory(inventory.slice(0, index).concat(inventory.slice(index + 1, inventory.length)));
  }
  const onTradeToInventory = index => {
    trade[index].location = "Inventory";
    setInventory([...inventory[index]]);
    setTrade(trade.slice(0, index).concat(inventory.slice(index + 1, inventory.length)));
  }
}