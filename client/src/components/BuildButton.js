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
  const [mortgage, setMortgage] = React.useState(null);

  const [showBuild, setShowBuild] = React.useState(false);
  const [showManage, setShowManage] = React.useState(false);

  
  React.useEffect(() => { 
    if (!modalIsOpen) setRightSideCard({});
    renderCard();
    setShowBuild(false);
    setShowManage(false);
    setTempCost(0);
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

  const confirmManage = (tempCost) => {
    const selectedCard = player.inventory[selectedIndex];
    selectedCard.house = tempHouse;
    player.setMoney(tempCost);
    setHouseState(tempHouse);
    setTempCost(0);
    console.log(player.money);
  }

  const addBuildHouse = () => {
    if (tempHouse < 5) {
      setTempHouse(tempHouse + 1);
      costCalc(tempHouse + 1);
    }
  }

  const subBuildHouse = () => {
    if (tempHouse > houseState) {
      setTempHouse(tempHouse - 1);

      costCalc(tempHouse - 1);
    }
  }

  const addManageHouse = () => {
    console.log("add")
    if (tempHouse < houseState) {
      setTempHouse(tempHouse + 1);
      profitCalc(tempHouse + 1);
    }
  }

  const subManageHouse = () => {
    if (tempHouse > 0 ) {
      setTempHouse(tempHouse - 1);
      profitCalc(tempHouse - 1);
    }
  }

  const mortgageHouse = () => {
    if (mortgage === false) {
      setMortgage(prevMortgage => { 
        console.log("morgage set to true");
        profitCalc(tempHouse, prevMortgage);
        return true;
      })
    } else if (mortgage === true) {
      setMortgage(prevMortgage => { 
        console.log("morgage set to false");
        profitCalc(tempHouse, prevMortgage);
        return false;
      })  
    }
  }

  const costCalc = tempHouse => {
    const selectedCard = player.inventory[selectedIndex];

    setTempCost(selectedCard.buildingCost * (tempHouse-houseState) )

    console.log("o.o: ", selectedCard.buildingCost, tempHouse, houseState)
  }

  const profitCalc = (tempHouse, prevMortgage) => {
    console.log("profit calculated", mortgage)
    const selectedCard = player.inventory[selectedIndex];
    if (prevMortgage === false) {
      setTempCost( (selectedCard.buildingCost/2 *(houseState-tempHouse)) + (player.inventory[selectedIndex].price/2) )
      console.log(tempCost);
    } else if (prevMortgage === true) {
      setTempCost( (selectedCard.buildingCost/2 *(houseState-tempHouse)) - (player.inventory[selectedIndex].price/2) )
      console.log(tempCost);
    } else {
     setTempCost(selectedCard.buildingCost/2 *(houseState-tempHouse)  )
    }
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
          setMortgage(card.mortgage);
        }} />)
      }
    }
    
    setLeftSideCards(gudCards);

    return gudCards;
  }

  const renderBuildSide = () => {
    return Object.entries(rightSideCard).length > 0 && (
      <>
        { <img src={rightSideCard.src} /> }
        <div className="cost-container">
          <p> Cost: </p>
          <p> { tempCost } </p>
        </div>
        <div style ={{ padding: "1rem" }}> Current: { houseState } </div>
        <div className="button-container">
          <button className="btn blue lighten-3" id = "subHouse" onClick={ () => subBuildHouse() }> - </button>
          <div style ={{ padding: "1rem" }}> New: { tempHouse } </div>
          <button className="btn blue lighten-3" id = "addHouse" onClick={ () => addBuildHouse() }> + </button>
        </div>
        <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => confirmBuild(tempCost) }> Confirm </button>
      </>
    );
  }

  const renderManageSide = () => {
    return Object.entries(rightSideCard).length > 0 && (
      <>
        { <img src={rightSideCard.src} /> }
        <div className="cost-container">
          <p> Profit: </p>
          <p> { tempCost } </p>
        </div>
        <div style ={{ padding: "1rem" }}> Current: { houseState } </div>
        <div className="button-container">
          <button className="btn blue lighten-3" id = "subHouse" onClick={ () => subManageHouse() }> - </button>
          <div style ={{ padding: "1rem" }}> New: { tempHouse } </div>
          <button className="btn blue lighten-3" id = "addHouse" onClick={ () => addManageHouse() }> + </button>
          <button className="btn blue lighten-3" id = "addHouse" onClick={ () => mortgageHouse() }> {mortgage? "Unmortgage" :  "Mortgage"} </button>
        </div>
        <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => confirmManage(tempCost) }> Confirm </button>
      </>
    );
  }

  const renderChoice = () => {
    if (!showBuild && !showManage )  {
      return (
        <div className="button-container">
          <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => setShowBuild(true) }> Build </button>
          <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => setShowManage(true) }> Manage </button>
        </div>
      );
    } else if (showBuild) {
      return renderBuildSide();
    } else if (showManage) {
      return renderManageSide();
    }
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
          { renderChoice() }
        </div>
      </div>
        
      </Modal>
    </div>
  );
}

export default BuildButton;