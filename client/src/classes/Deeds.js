export default class Deeds {
  constructor(name, type, index, color, rent, src, buildingCost) {
    this.name = name;
    this.type = type;
    this.index = index;
    this.color = color;
    this.currentRent = rent;
    this.src = src;
    this.buildingCost = buildingCost;
    this.house = 0;
  }
};  