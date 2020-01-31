import { useRef } from 'react';
import PubNub from 'pubnub';
import Swal from "sweetalert2";
import shortid  from 'shortid';

const usePubNub = (setIsPlaying) => {
  const lobbyChannel = useRef(null);
  const gameChannel = useRef(null);
  const roomId = useRef(null);
  const turnCounter = useRef(1);
  const me = useRef('');

  const pubnub = new PubNub({
    subscribeKey: 'sub-c-f28bdf0c-3db7-11ea-afe9-722fee0ed680',
    publishKey: 'pub-c-7045c7b8-54ee-4831-81e0-35058c0eabff'
  });

  const joinRoom = value => {
    roomId.current = value;
    lobbyChannel.current = 'lobby--' + roomId.current;
    pubnub.hereNow({
      channels: [lobbyChannel.current]
    }).then(response => {
      if (response.totalOccupancy < 2) {
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

        const publishConfig = {
          channel: lobbyChannel.current,
          message: {
            text: "Game Started"
          }
        };

        pubnub.publish(publishConfig, function(status, response) {

        });

        // Start the game.
        gameChannel.current = 'game--' + roomId.current;

        pubnub.subscribe({
          channels: [gameChannel.current],
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

        me.current = 'player2';
        setIsPlaying(true);
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

    Swal.fire({
      position: 'center',
      allowOutsideClick: false,
      title: 'Share this room ID with your friend',
      text: roomId.current,
      width: 275,
      padding: '0.7em',
      // Custom CSS
      customClass: {
        heightAuto: false,
        title: 'title-class',
        popup: 'popup-class',
        confirmButton: 'button-class'
      }
    });

    me.current = 'player1';
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