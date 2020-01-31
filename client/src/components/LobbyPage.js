import React, { useState } from 'react';
import usePubNub from '../hooks/useLobby';

import boardImage from '../assets/boards/Classic.jpg'

const Lobby = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me] = usePubNub(setIsPlaying);

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", margin: "0" }}>
            {
                !isPlaying? (
                    <div style={{ textAlign: "center" }}>
                        <h3 style={{ color: "#64b5f6", textShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}>Monopoly Beta</h3>
                        <button className="btn blue lighten-3" onClick={handleCreateRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Create Room</button>
                        <button className="btn blue lighten-3" onClick={handleJoinRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Join Room</button>
                    </div>
                ): (
                    <div className="row" style={{ width: "inherit" }}>
                        <div className="col s12" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img alt="Cannot load board." src={boardImage} style={{width: "900px", height: "auto"}} />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Lobby;