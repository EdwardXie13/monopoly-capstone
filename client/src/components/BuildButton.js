import React from 'react';
import Modal from 'react-modal';
import '../styles/BuildButton.css';
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const BuildButton = ({disabled, setIsRolled, handleDisownInventory, setInitialRent, initialRent, gamers, player, showManage, setShowManage, openBuild, setOpenBuild, rent, setRent, resolvePayment, handlePlayerChange, activator, setActivator, handleSetFinishedPlayer, loanShark }) => {
  // const [openBuild,setOpenBuild] = React.useState(false);
  const [leftSideCards, setLeftSideCards] = React.useState([]);
  const [rightSideCard, setRightSideCard] = React.useState({});
  const [tempCost, setTempCost] = React.useState(0);
  const [houseState, setHouseState] = React.useState();
  const [tempHouse, setTempHouse] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [mortgage, setMortgage] = React.useState(null);

  const [showBuild, setShowBuild] = React.useState(false);
  
  React.useEffect(() => { 
    if (!openBuild) setRightSideCard({});
    // renderCard();
    setTempCost(0);
  }, [player, showManage, rent, resolvePayment, activator, loanShark])
  
  function openModal() {
    setOpenBuild(true);
  }
 
  function closeModal(){
    setOpenBuild(false);
    setShowBuild(false);
    setShowManage(false);
    setLeftSideCards([]);
    setTempCost(0);
  }

  const confirmBuild = (tempCost) => {
    const selectedCard = player.inventory[selectedIndex];
    console.log(tempCost);
    if (player.money >= tempCost) {
      selectedCard.house = tempHouse;
      player.money -= tempCost;
      setHouseState(tempHouse);
      setTempCost(0);
      handlePlayerChange(player.name, player.money, player.location, player.inventory, player.index)
    }
  }

  const confirmManage = (tempCost) => {
    const selectedCard = player.inventory[selectedIndex];
    selectedCard.house = tempHouse;
    selectedCard.mortgage = mortgage;
    console.log(tempCost);
    player.money += tempCost;
    setHouseState(tempHouse);
    setTempCost(0);
    let amountToPay = 0;
    if (rent > 0) { 
      amountToPay = player.money > rent? rent : player.money;
      setRent(rent - amountToPay);
      setInitialRent(initialRent + amountToPay);
      player.money -= amountToPay;
      if (rent - amountToPay === 0) {
        // player, money, location, inventory, index      
        if (activator !== null) {
          console.log("activator money", gamers[activator.name].money, "amountToPay", amountToPay);
          handlePlayerChange(activator.name, gamers[activator.name].money + amountToPay, activator.location, activator.inventory, activator.index);
        }
        console.log("payer money", player.money);
        handlePlayerChange(player.name, player.money, player.location, player.inventory, player.index);
        // setActivator(null);
        handleSetFinishedPlayer(player);
        closeModal();
      }
    }
    if (player.money < rent ) {
      let temp = 0;
      for (let deed of player.inventory) {
        if (deed.mortgage === false) {
          temp++;
        }
      }
      if (temp === 0) {
        player.bankrupt = true;
        console.log("bankrupt", player)
 
        if (loanShark !== "Board") {
          console.log("money guess", player.money, rent, initialRent)
          handlePlayerChange(loanShark.name, loanShark.money + initialRent, loanShark.location, [...loanShark.inventory, ...gamers[player.name].inventory] , loanShark.index, loanShark.bankrupt);
        } else {
          handleDisownInventory(gamers[player.name].inventory);
          // handlePlayerChange(player.name, 0, player.location, player.inventory, player.index, player.bankrupt);;
        }

        handlePlayerChange(player.name, 0, player.location, [], player.index, player.bankrupt);
        closeModal();
        
        setIsRolled(true);
      }
    }
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
    if (tempHouse < houseState) {
      setTempHouse(tempHouse + 1);
      profitCalc(tempHouse + 1, !mortgage);
    }
  }

  const subManageHouse = () => {
    if (tempHouse > 0 ) {
      setTempHouse(tempHouse - 1);
      profitCalc(tempHouse - 1, !mortgage);
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
    console.log("plasdas", player)
    console.log("o.o: ", selectedCard.buildingCost, tempHouse, houseState)
  }

  const profitCalc = (tempHouse, prevMortgage) => {
    const selectedCard = player.inventory[selectedIndex];
    if (prevMortgage === false) {
      if (selectedCard.type === "Property") {
        console.log("tempHouse", tempHouse);
        const sign = selectedCard.mortgage? -1 : 1;
        selectedCard.mortgage === true? setTempCost((selectedCard.buildingCost/2 *(houseState-tempHouse))) 
        : setTempCost( (selectedCard.buildingCost/2 *(houseState-tempHouse)) + sign * (player.inventory[selectedIndex].price/2) )
      } else {
        console.log("a")
        setTempCost((player.inventory[selectedIndex].price/2) ) //display should be postive
      }
    } else if (prevMortgage === true) {
      if (selectedCard.type === "Property") {
        console.log("b");
        const sign = selectedCard.mortgage? -1 : 1;
        selectedCard.mortgage === false? setTempCost((selectedCard.buildingCost/2 *(houseState-tempHouse)))
        : setTempCost( (selectedCard.buildingCost/2 *(houseState-tempHouse)) + sign * (player.inventory[selectedIndex].price/2) )
      } else { 
        console.log("a")
        setTempCost(-(player.inventory[selectedIndex].price/2) ) //dispaly should be negatuive
      }
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


  const renderCard = isManage => {
    let gudCards = [];

    const canBuild = buildCheck(player.inventory);

    for (let i = 0; i < player.inventory.length; ++i) {
      const card = player.inventory[i];
      if (isManage || canBuild[card.color] === true) {
        gudCards.push(<img className="card-style" src={card.src} onClick={e => {
          document.querySelectorAll('.card-style').forEach(c => c.classList.remove('active-card-style'));
          e.target.classList.add('active-card-style');
          setSelectedIndex(i);
          setRightSideCard(card);
          setHouseState(card.house);
          setTempHouse(card.house);
          setMortgage(card.mortgage);
          setTempCost(0);
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
        <div className="confirm-button"> 
          <button className="btn blue lighten-3" onClick={ () => confirmBuild(tempCost) }> Confirm </button>
          <button className="btn blue lighten-3" onClick={ () =>  closeModal() }> Cancel </button>
        </div>
      </>
    );
  }

  const renderManageSide = () => {
    return Object.entries(rightSideCard).length > 0? (
      <>
        { <img src={rightSideCard.src} /> }
        <div className="cost-container">
          { rent > 0 && <p>Debt: {rent}</p> }
          <p> Profit: { tempCost } </p>
        </div>
        <div style ={{ padding: "1rem" }}> Current: { houseState } </div>
        <div className="button-container">
          <button className="btn blue lighten-3" id = "subHouse" onClick={ () => subManageHouse() }> - </button>
          <div style ={{ padding: "1rem" }}> New: { tempHouse } </div>
          <button className="btn blue lighten-3" id = "addHouse" onClick={ () => addManageHouse() }> + </button>
          <button className="btn blue lighten-3" id = "addHouse" onClick={ () => mortgageHouse() }> {mortgage? "Unmortgage" :  "Mortgage"} </button>
        </div>
        <div className="confirm-button"> 
          <button className="btn blue lighten-3" onClick={ () => confirmManage(tempCost) }> Confirm </button>
          <button className="btn blue lighten-3" disable={rent>0} onClick={ () =>  closeModal() }> Cancel </button>
        </div>
      </>
    ) : (
      <>
        { rent > 0 && <h1>Debt: {rent}</h1> }
      </>
    );
  }

  const renderChoice = () => {
    if (!showBuild && !showManage )  {
      return (
        <div className="button-container">
          <button className="btn blue lighten-3" id = "confirm-button" onClick={ () => {setShowBuild(true); renderCard(false); } }> Build </button>
          <button className="btn blue lighten-3 manage-button" id = "confirm-button" onClick={ () => {setShowManage(true); renderCard(true); } }> Manage </button>
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
      <button className='waves-effect waves-light btn-large' disabled ={disabled} onClick={openModal}>Manage</button>
      <Modal
        isOpen={openBuild}
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