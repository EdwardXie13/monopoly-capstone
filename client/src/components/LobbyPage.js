import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/LobbyPage.css';
import usePubNub from '../hooks/useLobby';
import boardImage from '../assets/boards/Classic.jpg';

import Image from '../assets/cards/Park Place.png';

const Lobby = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [imageSource, setImageSource] = useState('');
    const [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me] = usePubNub(setIsPlaying);

    const showThumbnail = src => {
        return <img src={src} style={{ position: "absolute", left: "0" }} />
    }

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", margin: "0" }}>
            {
                !isPlaying? (
                    <div style={{ textAlign: "center" }}>
                        <h3 style={{ color: "#64b5f6", textShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}><Link to="/">Monopoly Beta</Link></h3>
                        <button className="btn blue lighten-3" onClick={handleCreateRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Create Room</button>
                        <button className="btn blue lighten-3" onClick={handleJoinRoom} style={{ margin: "1rem", borderRadius: "1rem" }}>Join Room</button>
                    </div>
                ): (
                    <div className="row" style={{ width: "inherit" }}>
                        <div className="col s12" style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                            { showThumbnail(imageSource) }
                            <div style={{ position: "relative" }}>
                                <img alt="Cannot load board." src={boardImage} style={{width: "900px", height: "auto"}} />
                                <div id="parking" onMouseEnter={() => setImageSource(Image)} onMouseLeave={() => setImageSource('')}></div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Lobby;