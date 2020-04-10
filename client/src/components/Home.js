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
