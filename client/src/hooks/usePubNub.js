import { useRef, useEffect, useContext } from 'react';
import PubNub from 'pubnub';
import Swal from "sweetalert2";
import shortid  from 'shortid';

import RoomContext from '../contexts/RoomContext';
import backend from '../apis/backend';

const usePubNub = (setIsPlaying, setIsWaiting) => {
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

            pubnub.publish({ channel: lobbyChannel.current, message: { text: "Player Joined", players: res.data.players } });

            if (response.totalOccupancy === 3) {
              pubnub.publish({ channel: lobbyChannel.current, message: { text: "Game Started" } });
              gameChannel.current = 'game--' + roomId.current;
              pubnub.subscribe({ channels: [gameChannel.current], withPresence: true });
              setIsPlaying(true);
            }
            // const publishConfig = {
            //   channel: lobbyChannel.current,
            //   message: {
            //     text: "Game Started"
            //   }
            // };

            // pubnub.publish(publishConfig, function(status, response) {});
            // Start the game.
            // gameChannel.current = 'game--' + roomId.current;
    
            // pubnub.subscribe({
            //   channels: [gameChannel.current],
            //   error: error => {
            //     Swal.fire({
            //       position: 'center',
            //       allowOutsideClick: false,
            //       title: 'Error',
            //       text: JSON.stringify(error),
            //       width: 275,
            //       padding: '0.7em',
            //       customClass: {
            //         heightAuto: false,
            //         title: 'title-class',
            //         popup: 'popup-class',
            //         confirmButton: 'button-class'
            //       }
            //     });
            //   }
            // });
    
            // me.current = 'player2';
            // setIsPlaying(true);
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
      });

    // Swal.fire({
    //   position: 'center',
    //   allowOutsideClick: false,
    //   title: 'Share this room ID with your friend',
    //   text: roomId.current,
    //   width: 275,
    //   padding: '0.7em',
    //   // Custom CSS
    //   customClass: {
    //     heightAuto: false,
    //     title: 'title-class',
    //     popup: 'popup-class',
    //     confirmButton: 'button-class'
    //   }
    // });
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