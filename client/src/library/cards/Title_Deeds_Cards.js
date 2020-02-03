class Tiles {
    //Tiles
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    //Utilities
    constructor(name, type, price, rentNormal, rentBoth) {
        this.name = name,
        this.type = type,
        this.price = price,
        this.rentNormal = rentNormal,
        this.rentBoth = rentBoth;
        this.owner = "Bank",
        this.mortgaged = false;
    }
    //Railroad
    constructor(name, type, price, rentNormal, rentRR2, rentRR3,rentRR4) {
        this.name = name,
        this.type = type,
        this.price = price,
        this.rentNormal = rentNormal,
        this.rentRR2 = rentRR2,
        this.rentRR3 = rentRR3,
        this.rentRR4 =rentRR4,
        this.owner = "Bank",
        this.mortgaged = false;
    }
    //Property
    constructor(name, type, price, rentNormal, rentHouse1, rentHouse2, 
        rentHouse3,rentHouse4, rentHotel, buildingCosts) {
        this.name = name,
        this.type = type,
        this.price = price,
        this.rentNormal = rentNormal,
        this.rentHouse1 = rentHouse1,
        this.rentHouse2 = rentHouse2,
        this.rentHouse3 = rentHouse3,
        this.rentHouse4 = rentHouse4,
        this.rentHotel = rentHotel,
        this.buildingCosts = buildingCosts,
        this.owner = "Bank",
        this.mortgaged = false;
    }
}

export default board = [
    new Tiles("Go", null, null),
    new Tiles("MediterraneanAvenue", "Property", 60, 2, 10, 30, 90, 160, 250, 50),
    new Tiles("CommunityChest", null, null),
    new Tiles("BalticAvenue", "Property", 60, 4, 20, 60, 180, 320, 450, 50),
    new Tiles("IncomeTax", null, null),
    new Tiles("ReadingRailroad", "Railroad", 200, 25, 50, 100, 200),
    new Tiles("OrientalAvenue", "Property", 100, 6, 30, 90, 270, 400, 550, 50),
    new Tiles("Chance", null, null),
    new Tiles("VermontAvenue", "Property", 100, 6, 30, 90, 270, 400, 550, 50),
    new Tiles("ConnecticutAvenue", "Property", 120, 8, 40, 100, 300, 450, 600, 50),
    new Tiles("JustVisiting", null, null),
    new Tiles("StCharlesPlace", "Property", 140, 10, 50, 150, 450, 625, 750, 100),
    new Tiles("ElectricCompany", "Utilities", 150),
    new Tiles("StatesAvenue", "Property", 140, 10, 50, 150, 450, 625, 750, 100),
    new Tiles("VirginiaAvenue", "Property", 160, 12, 60, 180, 500, 700, 900, 100),
    new Tiles("PennsylvaniaRailroad", "Railroad", 200, 200, 25, 50, 100, 200),
    new Tiles("StJamesPlace", "Property", 180, 14, 70, 200, 550, 750, 950, 100),
    new Tiles("CommunityChest", null, null),
    new Tiles("TennesseeAvenue", "Property", 180, 14, 70, 200, 550, 750, 950, 100),
    new Tiles("NewYorkAvenue", "Property", 200, 16, 80, 220, 600, 800, 1000, 100),
    new Tiles("FreeParking", null, null),
    new Tiles("KentuckyAvenue", "Property", 220, 18, 90, 250, 700, 875, 1050, 150),
    new Tiles("Chance", null, null),
    new Tiles("IndianaAvenue", "Property", 220, 18, 90, 250, 700, 875, 1050, 150),
    new Tiles("IllinoisAvenue", "Property", 240, 20, 100, 300, 750, 925, 1100, 150),
    new Tiles("BandORailroad", "Railroad", 200, 200, 25, 50, 100, 200),
    new Tiles("AtlanticAvenue", "Property", 260, 22, 110, 330, 800, 975, 1150 ,150),
    new Tiles("VentnorAvenue", "Property", 260, 22, 110, 330, 800, 975, 1150 ,150),
    new Tiles("WaterWorks", "Utilities", 150),
    new Tiles("MarvinGardens", "Property", 280, 24, 120, 360, 850, 1025, 1200, 150),
    new Tiles("GoToJail", null, null),
    new Tiles("PacficAvenue", "Property", 300, 26, 130, 390, 900, 110, 1275, 200),
    new Tiles("NorthCarolinaAvenue", "Property", 300, 26, 130, 390, 900, 110, 1275, 200),
    new Tiles("CommunityChest", null, null),
    new Tiles("PennsylvaniaAvenue", "Property", 320, 28, 150, 450, 1000, 1200, 1400, 200),
    new Tiles("ShortLineRailroad", "Railroad", 200, 200, 25, 50, 100, 200),
    new Tiles("Chance", null, null),
    new Tiles("ParkPlace", "Property", 350, 35, 175, 500, 1100, 1300, 1500, 200),
    new Tiles("LuxuryTax", null, null),
    new Tiles("Boardwalk", "Property", 400, 50, 200, 600, 1400, 1700, 2000, 200) 
]