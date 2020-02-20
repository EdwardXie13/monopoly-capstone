export default class Player {
    constructor(name, location, index) {
      this.name = name;
      this.location = location;
      this.index = index;
      //this.money = 1500;
      this.money = 10000;
      this.jail = false;
      this.jailroll = 0;
      this.doubles = 0;
      this.cc_JailCard = false;
      this.c_JailCard = false;
      this.bidding = true;
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
  };