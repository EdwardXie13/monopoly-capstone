export default class Player {
  constructor(name) {
    this.name = name;
    this.location = "Go";
    this.index = 0;
    //this.money = 1500;
    this.money = 10000;
    this.jail = false;
    this.jailroll = 0;
    this.doubles = 0;
    this.cc_JailCard = false;
    this.c_JailCard = false;
    this.bidding = true;
    this.inventory = [];
  }
  setLocation(location, index) {
    this.location = location;
    this.index = index;
  }
  setMoney(amount){
    this.money += amount;
  }
  setJail(status) {
    this.jail = status;
  }
  setJailroll() {
    this.jailroll++;
  }
  resetJailroll() {
    this.jailroll = 0;
  }
  setDoubles() {
    this.doubles++;
  }
  resetDoubles() {
    this.doubles = 0;
  }
  addInventory(deed) {
    this.inventory.push(deed);
  }
};