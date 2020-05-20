import React from 'react';
import '../styles/InventoryUI.css';

const InventoryUI = ({ money, inventory }) => {
  const opacity = property => {
    return inventory.filter(deed => deed.name === property).length > 0? '1' : '0.5';
  }
  
  console.log("money", money)

  return (
    <div style={{ backgroundColor: "lightgray", maxWidth: "490px" }}>
      Money: {money}
      <div class="parent_container">
        {/* Brown Properties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "#A5682A", opacity: opacity('Mediterranean Avenue') }}>Mediterran</div>
          <div style={{ backgroundColor: "#A5682A", opacity: opacity('Baltic Avenue') }}>Baltic Ave</div>
        </div>

        {/* Light Blue Proerpties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "SkyBlue", opacity: opacity('Oriental Avenue') }}>Oriental</div>
          <div style={{ backgroundColor: "SkyBlue", opacity: opacity('Vermont Avenue') }}>Vermont</div>
          <div style={{ backgroundColor: "SkyBlue", opacity: opacity('Connecticut Avenue') }}>Conneticut</div>
        </div>

        {/* Pink Properties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "Pink", opacity: opacity('St. Charles Place') }}>StCharles</div>
          <div style={{ backgroundColor: "Pink", opacity: opacity('States Avenue') }}>StatesAve</div>
          <div style={{ backgroundColor: "Pink", opacity: opacity('Virginia Avenue') }}>Virginia</div>
        </div>

        {/* Orange Properties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "Orange", opacity: opacity('St. James Place') }}>StJames</div>
          <div style={{ backgroundColor: "Orange", opacity: opacity('Tennessee Avenue') }}>Tennessee</div>
          <div style={{ backgroundColor: "Orange", opacity: opacity('New York Avenue') }}>NewYork</div>
        </div>

        {/* Red Properties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "Red", opacity: opacity('Kentucky Avenue') }}>Kentucky</div>
          <div style={{ backgroundColor: "Red", opacity: opacity('Indiana Avenue') }}>Indiana</div>
          <div style={{ backgroundColor: "Red", opacity: opacity('Illinois Avenue') }}>Illinois</div>
        </div>

        {/* Yellow Properties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "Yellow", opacity: opacity('Atlantic Avenue') }}>Atlantic</div>
          <div style={{ backgroundColor: "Yellow", opacity: opacity('Ventnor Avenue') }}>Ventnor</div>
          <div style={{ backgroundColor: "Yellow", opacity: opacity('Marvin Gardens') }}>Marvin</div>
        </div>

        {/* Green Properties */}
        <div class="flex-container_vert">
          <div style={{ backgroundColor: "Green", opacity: opacity('Pacific Avenue') }}>Pacific</div>
          <div style={{ backgroundColor: "Green", opacity: opacity('North Carolina Avenue') }}>NorthC</div>
          <div style={{ backgroundColor: "Green", opacity: opacity('Pennsylvania Avenue') }}>PennAv</div>
        </div>

        {/* Dark Blue Properties */}
        <div class="flex-container_vert" style = {{color:"white"}}>
          <div style={{ backgroundColor: "Blue", opacity: opacity('Park Place') }}>ParkPlace</div>
          <div style={{ backgroundColor: "Blue", opacity: opacity('Boardwalk') }}>Boardwalk</div>
        </div>

        {/* Stations */}
        <div class="flex-container_vert" style = {{color:"white"}}>
          <div style={{ backgroundColor: "black", opacity: opacity('Reading Railroad') }}>Reading</div>
          <div style={{ backgroundColor: "black", opacity: opacity('Pennsylvania Railroad') }}>Penn</div>
          <div style={{ backgroundColor: "black", opacity: opacity('B. & O. Railroad') }}>B & O</div>
          <div style={{ backgroundColor: "black", opacity: opacity('Short Line Railroad') }}>ShortLine</div>
        </div>

        {/* Utilities */}
        <div class="flex-container_vert" style = {{color: "white"}}>
          <div style={{ backgroundColor: "black", opacity: opacity('Electric Company') }}>Electric</div>
          <div style={{ backgroundColor: "black", opacity: opacity('Water Works') }}>Water</div>
        </div>
      </div>
    </div>
  );
};

export default InventoryUI;