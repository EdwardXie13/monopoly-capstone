<<<<<<< HEAD

import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({handleCreateRoom,handleJoinRoom}) => {

  return (
    <div >
      <div style ={{position:"absolute",backgroundColor:"white", height:"95%", width:"500px", top:"20px",left:"20px",borderRadius: "1rem"}}>
            <div style={{ position:"relative", height:"96%",width:"96%",margin:"2%",borderRadius: "1rem", overflowY:"scroll", overflowX:"hidden"}}>

              <span style={{fontSize:"20pt"}}>Rooms</span>
              <form class="col s12">
                <div class="row">
                  <div class="input-field col s12">
                    <input placeholder="Search Rooms" id="first_name" type="text" class="validate"/>
                    {/* <label for="first_name">First Name</label> */}
                  </div>
                </div>
              </form>
              <div style={{ position:"relative", backgroundColor:"#c2efc2",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
                <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
              <div style={{ position:"relative", backgroundColor:"#aeeaae",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
              <div style={{padding:"10px", fontSize:"large"}}>
                  <div>Room Name: Rene's Room</div>
                  <div>Rules: Standard</div>
                  <div> None</div>
                  <div>Players 4/4</div>
                </div>
              </div>
                
            </div>

          </div>
            
          <div style ={{position:"absolute",backgroundColor:"white", height:"42%", width:"500px", top:"20px",left:"620px",borderRadius: "1rem"}}>
            <div style={{padding:"25px"}}>
            <form action="#">
                <div style={{fontSize:"27pt"}}>Create Room</div>
                <div style={{fontSize:"20pt"}}>Room Name: Rene's Room</div>
                <div style={{paddingTop:"20px"}}>
                  <span style={{padding:"20px"}}>
                    <label>
                      <input name="Privacy" type="radio" defaultChecked/>
                      <span style={{fontSize:"18pt", color:"black"}}>Public</span>
                    </label>
                  </span>
                  <span style={{padding:"20px"}}>
                    <label>
                      <input name="Privacy" type="radio" />
                      <span style={{fontSize:"18pt", color:"black"}}>Private</span>
                    </label>
                  </span>
                </div>
                <div style={{fontSize:"17pt",paddingTop:"20px"}}>Private Key:</div>
                <div style={{display:"inline-block"}}>
                  <div style={{fontSize:"20pt", paddingTop:"20px"}}>Rules:</div>
                  <p>
                    <label>
                      <input name="Rules" type="radio" defaultChecked />
                      <span style={{fontSize:"18pt", color:"black"}}>Standard</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input name="Rules" type="radio" />
                      <span style={{fontSize:"18pt", color:"black"}}>Custom</span>
                    </label>
                  </p>
                </div>
                <div style={{display:"inline-block", paddingTop:"20px", paddingLeft:"40px"}}>
                  <p>
                    <label>
                      <input type="checkbox" class="filled-in" />
                      <span style={{fontSize:"18pt", color:"black"}}>Free Parking Cash</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input type="checkbox" class="filled-in" />
                      <span style={{fontSize:"18pt", color:"black"}}>No Auction</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input type="checkbox" class="filled-in" />
                      <span style={{fontSize:"18pt", color:"black"}}>Uneven Bidding</span>
                    </label>
                  </p>
                </div>
                <button className="btn-large" onClick={{}} style={{ fontSize:"15pt", borderRadius: "1rem" }}>Create Room</button>
              </form>



            </div>
          </div>  
          <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#64b5f6", textShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}><Link to="/">Monopoly</Link></h3>
              <button className="btn blue lighten-3" onClick={handleCreateRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Create Room</button>
              <button className="btn blue lighten-3" onClick={handleJoinRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Join Room</button>
            </div>
    </div> 
  );
};

export default Home;

=======
import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from 'react';

import CreateRoomModal from './CreateRoomModal';
import backend from '../apis/backend';

const Home = forwardRef(({ pubnub, handleCreateRoom, handleJoinRoom, myRef }, ref) => {
  // const { rooms, setRooms } = useContext(HomeContext);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // handleFetchRooms();
    pubnub.subscribe({
      channels: ["lobby"],
      withPresence: true
    });

    backend.get('/room/')
    .then(res => {
      setRooms(res.data);
    });
  }, []);

  myRef.current = () => {
    backend.get('/room/')
    .then(res => {
      setRooms(res.data);
    });
  }
  // useImperativeHandle(ref, () => ({
  //   handleFetchRooms() {
  //     backend.get('/room/')
  //     .then(res => {
  //       setRooms(res.data);
  //     });
  //   }
  // }));

  const handleRoomClick = r => {
    if (r.private) {
      // Popup password prompt.
    } else {
      handleJoinRoom(r.roomId, r.name, "");
    }
  }

  const renderRooms = () => {
    return rooms.length? rooms.map(r => (
      <div onClick={() => handleRoomClick(r)} style={{ position:"relative", backgroundColor:"#c2efc2",height:"130px",width:"100%",marginTop:"10px",borderRadius: "1rem"}}>
        <div style={{padding:"10px", fontSize:"large"}}>
          <div>Room Name: {r.name}</div>
          <div>Rules: Standard</div>
          <div> None</div>
          <div>Players {r.players.length}/4</div>
        </div>
      </div>
    )) : null;
  }

  return (
    <>
      <div style ={{ position: "fixed", backgroundColor:"white", height: "95vh", width:"95%", borderRadius: "1rem" }}>
        <div style={{ position:"relative", height:"96%",width:"96%",margin:"2%",borderRadius: "1rem", overflowX:"hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{fontSize:"20pt"}}>Rooms</span>
            <CreateRoomModal handleCreateRoom={handleCreateRoom} />
          </div>
          <form class="col s12">
            <div class="row">
              <div class="input-field col s12">
                <input placeholder="Search Rooms" id="first_name" type="text" class="validate"/>
                {/* <label for="first_name">First Name</label> */}
              </div>
            </div>
          </form>
          { renderRooms() }
        </div>
      </div>

      {/* <div style={{ textAlign: "center" }}>
        <h3 style={{ color: "#64b5f6", textShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}><Link to="/">Monopoly</Link></h3>
        <button className="btn blue lighten-3" onClick={handleCreateRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Create Room</button>
        <button className="btn blue lighten-3" onClick={handleJoinRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Join Room</button>
      </div> */}
    </>
  );
});

export default Home;
>>>>>>> 970801f448769f3c84d101e61b06205c1a9cfe22
