export default class Deeds {
  constructor(name, type, index, color, rent, src, buildingCost, price, mortgage) {
    this.name = name;
    this.type = type;
    this.index = index;
    this.color = color;
    this.currentRent = rent;
    this.src = src;
    this.buildingCost = buildingCost;
    this.house = 0;
    this.price = price;
    this.mortgage = mortgage;
  }
};  