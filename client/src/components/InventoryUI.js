import React from 'react';
import '../styles/InventoryUI.css';

const InventoryUI = () => {
  return (
    <div style="background-color: lightgray; max-width:490px">
      Money: 1000
      <div class="parent_container">
        {/* Brown Properties */}
        <div class="flex-container_vert">
          <div style="background-color: #A5682A">Mediterran</div>
          <div style="background-color: #A5682A">Baltic Ave</div>
        </div>

        {/* Light Blue Proerpties */}
        <div class="flex-container_vert">
          <div style="background-color: SkyBlue">Oriental</div>
          <div style="background-color: SkyBlue">Vermont</div>
          <div style="background-color: SkyBlue">Conneticut</div>
        </div>

        {/* Pink Properties */}
        <div class="flex-container_vert">
          <div style="background-color: Pink">StCharles</div>
          <div style="background-color: Pink">States Ave</div>
          <div style="background-color: Pink">Virginia</div>
        </div>

        {/* Orange Properties */}
        <div class="flex-container_vert">
          <div style="background-color: Orange">StJames</div>
          <div style="background-color: Orange">Tennessee</div>
          <div style="background-color: Orange">NewYork</div>
        </div>

        {/* Red Properties */}
        <div class="flex-container_vert">
          <div style="background-color: Red">Kentucky</div>
          <div style="background-color: Red">Indiana</div>
          <div style="background-color: Red">Illinois</div>
        </div>

        {/* Yellow Properties */}
        <div class="flex-container_vert">
          <div style="background-color: Yellow">Atlantic</div>
          <div style="background-color: Yellow">Ventnor</div>
          <div style="background-color: Yellow">Marvin</div>
        </div>

        {/* Green Properties */}
        <div class="flex-container_vert">
          <div style="background-color: Green">Pacific</div>
          <div style="background-color: Green">NorthC</div>
          <div style="background-color: Green">PennAv</div>
        </div>

        {/* Dark Blue Properties */}
        <div class="flex-container_vert" style = {{color:"white"}}>
          <div style="background-color: Blue">Park Place</div>
          <div style="background-color: Blue">Boardwalk</div>
        </div>

        {/* Stations */}
        <div class="flex-container_vert" style = {{color:"white"}}>
          <div style="background-color: black">Reading</div>
          <div style="background-color: black">Penn</div>
          <div style="background-color: black">B & O</div>
          <div style="background-color: black">ShortLine</div>
        </div>

        {/* Utilities */}
        <div class="flex-container_vert" style = {{color: "white"}}>
          <div style="background-color: black">Electric</div>
          <div style="background-color: black">Water</div>
        </div>
      </div>
    </div>
  );
};

export default InventoryUI;