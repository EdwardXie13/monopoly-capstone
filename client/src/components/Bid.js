import React, { useContext } from 'react';
import Modal from 'react-modal';

import '../styles/Bid.css';
import BiddingContext from '../contexts/BiddingContext';
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const Bid = ({ me, player, openBid, setOpenBid, handleDeclineBidding, handleAcceptBidding, highestBid }) => {
  var subtitle;
  const [newBid, setnewBid] = React.useState(0);
  const { name } = useContext(BiddingContext);

  React.useEffect(() => {
  }, [openBid, setOpenBid, player])
  
  function openModal() {
    setOpenBid(true);
  }
 
  function closeModal(){
    setOpenBid(false);
  }

  const accept = e => {
    console.log("newBid", parseInt(newBid));
    console.log("player money", player.money);
    console.log("hgihest bid amount", parseInt(highestBid.amount));
    console.log(parseInt(newBid) <= player.money, parseInt(newBid) > parseInt(highestBid.amount))
    
    if (parseInt(newBid) <= player.money && parseInt(newBid) > parseInt(highestBid.amount)) {
      console.log("milk and tiddies")
      handleAcceptBidding(newBid, me.current); // newBid > highestBid
      setOpenBid(false);
    } else {
      e.preventDefault();
    }
  }

  const decline = () => {
    console.log("name", name);
    handleDeclineBidding(player, name, highestBid.amount);
    setOpenBid(false);
  }
  
  return (
    <div>
      <Modal
        isOpen={openBid}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        >
      <div className="bid-container">
        <div className="display">
          <p> Bidding for: </p>
          <p> { name } </p>
        </div>
        <div className="display">
          <p> The current highest bid is: </p>
          <p> { highestBid.amount } </p>
        </div>
        <input type="number" onChange={e => setnewBid(e.target.value)} />
        <button className="btn blue lighten-3" id = "accept-button" onClick={ e => accept(e) }> Accept </button>
        <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => decline()}> Decline </button>
      </div>
        
      </Modal>
    </div>
  );
}

export default Bid;