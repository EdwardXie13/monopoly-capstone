import React from 'react';
import Modal from 'react-modal';
import '../styles/BuildButton.css';
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const BuildButton = ({ player }) => {
  var subtitle;
  const [modalIsOpen,setIsOpen] = React.useState(false);
  const [leftSideCards, setLeftSideCards] = React.useState([]);
  const [rightSideCard, setRightSideCard] = React.useState({});
  const [tempCost, setTempCost] = React.useState(0);
  const [houseState, setHouseState] = React.useState();
  const [tempHouse, setTempHouse] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  
  React.useEffect(() => { 
    if (!modalIsOpen) setRightSideCard({});
    renderCard();
  }, [modalIsOpen])
  
  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal(){
    setIsOpen(false);
  }

  const confirmBuild = (tempCost) => {
    const selectedCard = player.inventory[selectedIndex];
    selectedCard.house = tempHouse;
    if (player.money >= tempCost) {
      console.log(player.money);
      player.setMoney(-tempCost);
      console.log(player.money);
      setHouseState(tempHouse);
      setTempCost(0);
    }
  }

  const addHouse = () => {
    console.log("add");
    if (tempHouse < 5) {
      setTempHouse(tempHouse + 1);
      costCalc(tempHouse + 1);
    }
  }

  const subHouse = () => {
    console.log("minus")
    if (tempHouse > houseState) {
      setTempHouse(tempHouse - 1);

      costCalc(tempHouse - 1);
    }
  }

  const costCalc = tempHouse => {
    const selectedCard = player.inventory[selectedIndex];

    setTempCost(selectedCard.buildingCost * (tempHouse-houseState) )

    console.log("o.o: ", selectedCard.buildingCost, tempHouse, houseState)
  }

  const buildCheck = inventory => {
    let canBuild = { Red: false, Yellow: false, Green: false, DarkBlue: false, Brown: false, LightBlue: false, Pink: false, Orange: false };
    let counts = {};

    for (var i=0; i<inventory.length; ++i) {
      const maxCount = inventory[i].color === 'Brown' || inventory[i].color === 'DarkBlue'? 2 : 3;
      counts[inventory[i].color] = (counts[inventory[i].color] || 0) + 1;
      if (counts[inventory[i].color] === maxCount ) canBuild[inventory[i].color] = true;
    }

    return canBuild;
  }

  const renderCard = () => {
    let gudCards = [];
    const canBuild = buildCheck(player.inventory);

    for (let i = 0; i < player.inventory.length; ++i) {
      const card = player.inventory[i];
      if (canBuild[card.color] === true) {
        gudCards.push(<img className="card-style" src={card.src} onClick={e => {
          document.querySelectorAll('.card-style').forEach(c => c.classList.remove('active-card-style'));
          e.target.classList.add('active-card-style');
          setSelectedIndex(i);
          setRightSideCard(card);
          setHouseState(card.house);
          setTempHouse(card.house);
        }} />)
      }
    }
    
    setLeftSideCards(gudCards);

    return gudCards;
  }

  const renderRightSide = () => {
    return Object.entries(rightSideCard).length > 0 && (
      <>
        { <img src={rightSideCard.src} /> }
        <div className="cost-container">
          <p> Cost: </p>
          <p> { tempCost } </p>
        </div>
        <div style ={{ padding: "1rem" }}> Current: { houseState } </div>
        <div className="button-container">
          <button className="btn blue lighten-3" id = "subHouse" onClick={ () => subHouse() }> - </button>
          <div style ={{ padding: "1rem" }}> New: { tempHouse } </div>
          <button className="btn blue lighten-3" id = "addHouse" onClick={ () => addHouse() }> + </button>
        </div>
        <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => confirmBuild(tempCost) }> Confirm </button>
      </>
    );
  }
 
  return (
    <div>
      <button className='waves-effect waves-light btn-large' onClick={openModal}>Build</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
      <div className="row build-container">
        <div className= "inventory col s6">
          { leftSideCards }
        </div>

        <div className= "right-side col s6">
          { renderRightSide() }
        </div>
      </div>
        
      </Modal>
    </div>
  );
}

export default BuildButton;