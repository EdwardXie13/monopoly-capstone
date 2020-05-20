import React from 'react';
import InventoryUI from '../components/InventoryUI';

const Card = ({ renderHistory, gamers }) => {
  return (
    <div className="col s12 m6" >
      <div className="card blue-grey darken-1" style ={{ borderRadius: "5px", overflow:"auto", display: "block", height:"99%"}}>
        <div className="card-content white-text">
          <span className="card-title">Players</span>
        </div>
        
        <div className="card-action">
          <a href="#" onClick={""}>{Object.keys(gamers)[0]}</a><br/>
          <InventoryUI money = {Object.values(gamers)[0].money} inventory={ Object.values(gamers)[0].inventory } />
          <a href="#">{Object.keys(gamers)[1]}</a><br/>
          <InventoryUI money = {Object.values(gamers)[1].money} inventory={ Object.values(gamers)[1].inventory } />
          {Object.keys(gamers).length > 2 && (<><a href="#">{Object.keys(gamers)[2]}</a><br/>
          <InventoryUI money = {Object.values(gamers)[2].money} inventory={ Object.values(gamers)[2].inventory } /></>)}
          {Object.keys(gamers).length > 3 && (<><a href="#">{Object.keys(gamers)[3]}</a><br/>
          <InventoryUI money = {Object.values(gamers)[3].money} inventory={ Object.values(gamers)[3].inventory } /></>)}
        </div>

        <div className="card-content white-text">
          <span className="card-title">Move History</span>
        </div>

        <div className="card-action">
          <div class="collection">
            { renderHistory() }
            {/* <a href="#!" class="collection-item"><span class="new badge"></span>Alan ate your knight</a>
            <a href="#!" class="collection-item"><span class="new badge"></span>Alan 5 steps to jail</a>
            <a href="#!" class="collection-item">Alan</a>
            <a href="#!" class="collection-item"><span class="badge"></span>Alan</a>
            <a href="#!" class="collection-item"><span class="badge"></span>Alan</a> */}
          </div>
        </div>
      </div>
    </div> 
  );
};

export default Card;