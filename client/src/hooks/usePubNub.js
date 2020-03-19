import { useRef, useEffect, useContext } from 'react';
import PubNub from 'pubnub';
import Swal from "sweetalert2";
import Player from '../classes/Player';
import shortid  from 'shortid';

import RoomContext from '../contexts/RoomContext';
import backend from '../apis/backend';

const usePubNub = (setIsPlaying, setIsWaiting, gamers, setGamers) => {
  const lobbyChannel = useRef(null);
  const gameChannel = useRef(null);
  const roomId = useRef(null);
  const turnCounter = useRef(1);
  const me = useRef('');
  const { players, setPlayers, setCode } = useContext(RoomContext);

  const pubnub = new PubNub({
    publishKey: "pub-c-d1c0326e-1d91-434d-a115-8a73c59e3381",
    subscribeKey: "sub-c-bf23c8b4-5bf8-11ea-9a59-eab2515ceb0d"
  });

  useEffect(() => {
    pubnub.addListener({
      status: function(statusEvent) { },
      message: function(msg) {
        if (msg.message.text === "Game Started") {
          setIsPlaying(true);
          gameChannel.current = 'game--' + roomId.current;
          pubnub.subscribe({ 
            channels: [gameChannel.current],
            withPresence: true,
            error: error => {
              Swal.fire({
                position: 'center',
                allowOutsideClick: false,
                title: 'Error',
                text: JSON.stringify(error),
                width: 275,
                padding: '0.7em',
                customClass: {
                  heightAuto: false,
                  title: 'title-class',
                  popup: 'popup-class',
                  confirmButton: 'button-class'
                }
              });
            }
          });
          Swal.close();
        } else if (msg.message.text === "Player Joined") {
          // Update players state with msg.message.players.
          setPlayers(msg.message.players);
          
          const currentPlayer = new Player(msg.message.players[msg.message.players.length-1].email);

          setGamers(prevGamers => { return { ...prevGamers, [msg.message.players[msg.message.players.length-1].email]: currentPlayer } });
          
        }
      }
    });

    return () => {
      pubnub.unsubscribeAll();
    }
  }, []);

  const joinRoom = value => {
    roomId.current = value;
    lobbyChannel.current = 'lobby--' + roomId.current;
    
    pubnub.hereNow({
      channels: [lobbyChannel.current]
    }).then(response => {
      if (response.totalOccupancy < 4) {
        pubnub.subscribe({
          channels: [lobbyChannel.current],
          withPresence: true,
          error: error => {
            Swal.fire({
              position: 'center',
              allowOutsideClick: false,
              title: 'Error',
              text: JSON.stringify(error),
              width: 275,
              padding: '0.7em',
              customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class'
              }
            });
          }
        })

        backend.put('/room/join', { roomId: roomId.current })
          .then(res => {
            setCode(roomId.current);
            setPlayers(res.data.players);
            setIsWaiting(true);
            console.log("meow", res.data.players)
            pubnub.publish({ channel: lobbyChannel.current, message: { text: "Player Joined", players: res.data.players } });
            me.current = res.data.players[res.data.players.length-1].email;
            
            let existingPlayers = {};

            for (let p of res.data.players) {
              existingPlayers[p.email] = new Player(p.email);
            }

            const currentPlayer = new Player(me.current);

            setGamers({ ...existingPlayers, [me.current]: currentPlayer });

            console.log(response.totalOccupancy);
            if (response.totalOccupancy === 1) {
              pubnub.publish({ channel: lobbyChannel.current, message: { text: "Game Started" } });
              gameChannel.current = 'game--' + roomId.current;
              pubnub.subscribe({ channels: [gameChannel.current], withPresence: true });
              setIsPlaying(true);
            }
          });
      } else {
        Swal.fire({
          position: 'center',
          allowOutsideClick: false,
          title: 'Error',
          text: 'Game in progress. Try another room.',
          width: 275,
          padding: '0.7em',
          customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
            confirmButton: 'button-class'
          }
        });
      }
    })
  }

  const handleCreateRoom = () => {
    roomId.current = shortid.generate().substring(0,5);
    lobbyChannel.current = 'lobby--' + roomId.current;

    pubnub.subscribe({
      channels: [lobbyChannel.current],
      withPresence: true,
      error: error => {
        Swal.fire({
          position: 'center',
          allowOutsideClick: false,
          title: 'Error',
          text: JSON.stringify(error),
          width: 275,
          padding: '0.7em',
          customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
            confirmButton: 'button-class'
          }
        });
      }
    });

    backend.post('/room/create', { roomId: roomId.current })
      .then(res => {
        setPlayers(res.data.players);
        setCode(roomId.current);
        setIsWaiting(true);

        me.current = res.data.players[0].email;
        
        const currentPlayer = new Player(me.current);

        setGamers({ ...gamers, [me.current]: currentPlayer });
      });
  }

  const handleJoinRoom = () => {
    Swal.fire({
      title: "Join a Game Lobby",
      position: 'center',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter the room id',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 500,
      // padding: '0.7em',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class ',
        cancelButton: 'join-button-class'
      } 
    }).then(result => {
      if(result.value){
        joinRoom(result.value);
      }
    });
  }

  return [pubnub, handleCreateRoom, handleJoinRoom, gameChannel, roomId, turnCounter, me];
}

export default usePubNub;