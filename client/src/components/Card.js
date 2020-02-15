import React from 'react';

const Card = () => {
    
    return (
        
        <div className="col s12 m6" >
          <div className="card blue-grey darken-1" style ={{ borderRadius: "5px", overflow:"auto", display: "block", height:"99%"}}>
            <div className="card-content white-text">
              <span className="card-title">Players</span>
            </div>
            <div className="card-action">
              <a href="#" onClick={""}>Player 1</a><br/>
              <div style={{backgroundColor:"white", borderRadius: "10px", width:"100%", height:"80px", padding:"15px", marginTop:"10px", marginBottom:"15px"}}></div>
              <a href="#">Player 2</a><br/>
              <div style={{backgroundColor:"white", borderRadius: "10px", width:"100%", height:"80px", padding:"15px", marginTop:"10px", marginBottom:"15px"}}></div>
              <a href="#">Player 3</a><br/>
              <a href="#">Player 4</a><br/>
            </div>

            <div className="card-content white-text">
              <span className="card-title">Move History</span>
            </div>
            <div className="card-action">
                <div class="collection">
                    <a href="#!" class="collection-item"><span class="new badge"></span>Alan ate your knight</a>
                    <a href="#!" class="collection-item"><span class="new badge"></span>Alan 5 steps to jail</a>
                    <a href="#!" class="collection-item">Alan</a>
                    <a href="#!" class="collection-item"><span class="badge"></span>Alan</a>
                    <a href="#!" class="collection-item"><span class="badge"></span>Alan</a>
                </div>
            </div>
          </div>
        </div>
      
    );
};

export default Card;