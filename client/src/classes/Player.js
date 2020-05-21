import Deeds from './Deeds';

import Default from '../assets/cards/Default.png';
import AtlanticAvenue from '../assets/cards/Atlantic Avenue.png';
import BandORailroad from '../assets/cards/B and O Railroad.png';
import BalticAvenue from '../assets/cards/Baltic Avenue.png';
import Boardwalk from '../assets/cards/Boardwalk.png';
import ConnecticutAvenue from '../assets/cards/Connecticut Avenue.png';
import ElectricCompany from '../assets/cards/Electric Company.png';
import IllinoisAvenue from '../assets/cards/Illinois Avenue.png';
import IndianaAvenue from '../assets/cards/Indiana Avenue.png';
import KentuckyAvenue from '../assets/cards/Kentucky Avenue.png';
import MarvinGardens from '../assets/cards/Marvin Gardens.png';
import MediterraneanAvenue from '../assets/cards/Mediterranean Avenue.png';
import NewYorkAvenue from '../assets/cards/New York Avenue.png';
import NorthCarolinaAvenue from '../assets/cards/North Carolina Avenue.png';
import OrientalAvenue from '../assets/cards/Oriental Avenue.png';
import PacificAvenue from '../assets/cards/Pacific Avenue.png';
import ParkPlace from '../assets/cards/Park Place.png';
import PennsylvaniaAvenue from '../assets/cards/Pennsylvania Avenue.png';
import PennsylvaniaRailroad from '../assets/cards/Pennsylvania Railroad.png';
import ReadingRailroad from '../assets/cards/Reading Railroad.png';
import ShortLineRailroad from '../assets/cards/Short Line Railroad.png';
import StCharlesPlace from '../assets/cards/St Charles Place.png';
import StJamesPlace from '../assets/cards/St James Place.png';
import StatesAvenue from '../assets/cards/States Avenue.png';
import TennesseeAvenue from '../assets/cards/Tennessee Avenue.png';
import VentnorAvenue from '../assets/cards/Ventnor Avenue.png';
import VermontAvenue from '../assets/cards/Vermont Avenue.png';
import VirginiaAvenue from '../assets/cards/Virginia Avenue.png';
import WaterWorks from '../assets/cards/Water Works.png';

export default class Player {
  constructor(name) {
    this.name = name;
    this.location = "Go";
    this.index = 0;
    this.sprite = "";
    // if (name === "1@2.com") this.sprite = "onion-frog";
    this.money = 1500;
    // this.money = 10000;
    // this.money = 0;
    this.jail = false;
    this.jailroll = 0;
    this.doubles = 0;
    this.cc_JailCard = false;
    this.c_JailCard = false;
    this.bidding = true;
    this.bankrupt = false;
    this.spriteSrc = { srcUp: '', srcDown: '', srcleft: '', srcRight: '' };
    this.inventory = [];
    // if (name === "1@1.com") {
    //   this.inventory = [
    //     new Deeds("Mediterranean Avenue", "Property", 1, "Brown" , 2, MediterraneanAvenue, 50, 60, false)]
        //new Deeds("Baltic Avenue", "Property", 3, "Brown", 4, BalticAvenue, 50, 60, false),
        //new Deeds("Oriental Avenue", "Property", 6, "LightBlue", 6, OrientalAvenue, 50, 100, false)]
    //}// else { this.inventory = [
    //   new Deeds("Vermont Avenue", "Property", 8, "LightBlue", 6, VermontAvenue, 50, 100, false),
    //   new Deeds("Connecticut Avenue", "Property", 9, "LightBlue", 8, ConnecticutAvenue, 50, 120, false),
    //   new Deeds("St. Charles Place", "Property", 11, "Pink", 10, StCharlesPlace, 100, 140, false)]
    // }
  }
  // setLocation(location, index) {
  //   this.location = location;
  //   this.index = index;
  // }
  // setMoney(amount){
  //   this.money += amount;
  // }
  // setJail(status) {
  //   this.jail = status;
  // }
  // setJailroll() {
  //   this.jailroll++;
  // }
  // resetJailroll() {
  //   this.jailroll = 0;
  // }
  // setDoubles() {
  //   this.doubles++;
  // }
  // resetDoubles() {
  //   this.doubles = 0;
  // }
  addInventory(deed) {
    this.inventory.push(deed);
  }
};