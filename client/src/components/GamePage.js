import React from 'react';
import Swal from 'sweetalert2'
// import '../styles/GamePage.css';
// import Brown from '../assets/tradingCards/Brown.png';
import BuildButton from './BuildButton';

const Trade = () => {
  
  //var arr = [Brown, Brown, Brown]
  // Swal.fire({
  //   title: 'Build',
  //   customClass: {
  //     container: 'container-class',
  //     popup: 'popup-class',
  //     header: 'header-class',
  //     title: 'title-class',
  //     text: 'text-class',
  //     closeButton: 'close-button-class',
  //     icon: 'icon-class',
  //     image: 'image-class',
  //     content: 'content-class',
  //     actions: 'actions-class',
  //     confirmButton: 'confirm-button-class',
  //     cancelButton: 'cancel-button-class',
  //     footer: 'footer-class'
  //   }
  // })

  return (
    <div>
      <BuildButton />
    </div>
  );
}

export default Trade;