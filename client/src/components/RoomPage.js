import React, { useContext } from 'react';

import '../styles/RoomPage.css';
import RoomContext from '../contexts/RoomContext';

const RoomPage = () => {
    const { players, code } = useContext(RoomContext);
    
    const renderPlayers = () => {
        return players.map(player => {
            return (
                <span>
                    <img className="player-avatar" src="https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png" />
                    <div className="player-name">Player {player}</div>
                </span>
            );  
        });
    }

    return (
        <div className="room-container">
            <div className="white-layer">
                <div className="room-title">Room: {code}</div>

                { renderPlayers() }
            </div>
        </div>
    )
};

export default RoomPage;