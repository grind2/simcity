const chai = window.chai
const expect = chai.expect

describe('newGameTable', ()=>{
  it('should reset the gameTable',()=>{

    gameTable[2][2] = new Road("Road", 0)
    for (let i = 0; i < 10; i++) {
    
      for (let j = 0; j < 20; j++) {
        gameTable[i][j] = new Field("Field")
      }
    }
    for (let i = 0; i < 10; i++) {
    
      for (let j = 0; j < 20; j++) {
        expect(gameTable[i][j].type).to.deep.equal("Field")
      }
    }
  })
})

describe('newRoad', () => {
  it('shoul build a new Road', () => {

    let seged = money
    gameTable[1][2] = new Road("Road", 40)
    expect(gameTable[1][2].type).to.deep.equal("Road")
    expect(money).to.deep.equal(seged-roadCost)
    gameTable[0][2] = new Road("Road", 40)
    gameTable[2][2] = new Road("Road", 40)
    gameTable[3][2] = new Road("Road", 40)
    gameTable[4][2] = new Road("Road", 40)
    gameTable[5][2] = new Road("Road", 40)
    expect(gameTable[0][2].type).to.deep.equal("Road")
    expect(gameTable[2][2].type).to.deep.equal("Road")
    expect(gameTable[3][2].type).to.deep.equal("Road")
    expect(gameTable[4][2].type).to.deep.equal("Road")
    expect(gameTable[5][2].type).to.deep.equal("Road")
  })
})

describe('isConnectedToRoad true', () => {
  it('should check if the tile is next to a Road', () => {

    expect(isConnectedToRoad(0,2)).to.deep.equal(true)
    expect(isConnectedToRoad(2,2)).to.deep.equal(true)
    expect(isConnectedToRoad(1,3)).to.deep.equal(true)
    expect(isConnectedToRoad(1,1)).to.deep.equal(true)
  })
})

describe('isConnectedToRoad false', () => {
  it('should check if the tile is next to a Road', () => {

    expect(isConnectedToRoad(5,5)).to.deep.equal(false)
  })
})

describe('isConnectedToRoad undefined', () => {
  it('should check if the tile is next to a Road', () => {

    expect(isConnectedToRoad(-3,5)).to.deep.equal(false)
  })
})

describe('newResidental', () => {
  it('shoul build a new Residential area', () => {

    let seged = money
    gameTable[0][1] = new Residential("Residential", resCost, 0)
    expect(gameTable[0][1].type).to.deep.equal("Residential")
    expect(money).to.deep.equal(seged-resCost)
  })
})

describe('isNearByPolice false', () => {
  it('should check if a Police Station is nearby', () => {

    expect(gameTable[0][1].isNearByPolice(0,1)).to.deep.equal(false)
  })
})

describe('isNearByFireDp false', () => {
  it('should check if a Fire Department is nearby', () => {

    expect(gameTable[0][1].isNearByFireDp(0,1)).to.deep.equal(false)
  })
})

describe('isNearByStadium false', () => {
  it('should check if a Stadium is nearby', () => {

    expect(gameTable[0][1].isNearByStadium(0,1)).to.deep.equal(false)
  })
})

describe('newIndustrial', () => {
  it('shoul build a new Industrial area', () => {

    let seged = money
    gameTable[5][1] = new Industrial("Industrial", indCost, 0)
    expect(gameTable[5][1].type).to.deep.equal("Industrial")
    expect(money).to.deep.equal(seged-indCost)
  })
})

describe('newService', () => {
  it('shoul build a new Service area', () => {

    let seged = money
    gameTable[5][3] = new Service("Service", serCost, 0)
    expect(gameTable[5][3].type).to.deep.equal("Service")
    expect(money).to.deep.equal(seged-serCost)
  })
})

describe('newPolice', () => {
  it('shoul build a new Police Station', () => {

    let seged = money
    gameTable[2][1] = new Police("Police", polCost)
    expect(gameTable[2][1].type).to.deep.equal("Police")
    expect(money).to.deep.equal(seged-polCost)
  })
})

describe('findClosestFireDp wrong', () => {
  it('shoul check for closest Fire Department', () => {

    expect(findClosestFireDp(2,2)).to.deep.equal(null)
  })
})

describe('newFireDp', () => {
  it('shoul build a new Fire Department', () => {

    let seged = money
    gameTable[2][3] = new FireDp("FireDp", fireCost)
    expect(gameTable[2][3].type).to.deep.equal("FireDp")
    expect(money).to.deep.equal(seged-fireCost)
  })
})

describe('newStadium', () => {
  it('shoul build a new Stadium', () => {

    let seged = money
    let z = 3
    let w = 3
    gameTable[z][w] = new StadiumTL("StadiumTL", stadionCost);
    gameTable[z + 1][w] = new StadiumDL("StadiumDL");
    gameTable[z][w + 1] = new StadiumTR("StadiumTR");
    gameTable[z + 1][w + 1] = new StadiumDR("StadiumDR");
    expect(gameTable[z][w].type).to.deep.equal("StadiumTL")
    expect(gameTable[z+1][w].type).to.deep.equal("StadiumDL")
    expect(gameTable[z][w+1].type).to.deep.equal("StadiumTR")
    expect(gameTable[z+1][w+1].type).to.deep.equal("StadiumDR")
    expect(money).to.deep.equal(seged-stadionCost)
  })
})

describe('isNearByPolice true', () => {
  it('should check if a Police Station is nearby', () => {

    expect(gameTable[0][1].isNearByPolice(0,1)).to.deep.equal(true)
  })
})

describe('isNearByFireDp true', () => {
  it('should check if a Fire Department is nearby', () => {

    expect(gameTable[0][1].isNearByFireDp(0,1)).to.deep.equal(true)
  })
})

describe('isNearByStadium true', () => {
  it('should check if a Stadium is nearby', () => {

    expect(gameTable[0][1].isNearByStadium(0,1)).to.deep.equal(true)
  })
})

describe('areRoadsConnected true', () => {
  it('should check if all of the Roads are connected', () => {

    expect(areRoadsConnected(gameTable)).to.deep.equal(true)
  })
})

describe('areRoadsConnected false', () => {
  it('should check if all of the Roads are connected', () => {

    gameTable[5][5] = new Road("Road", 40)
    expect(areRoadsConnected(gameTable)).to.deep.equal(false)
    gameTable[5][5] = new Field("Field")
  })
})

describe('generateRandomAge', () => {
  it('should generate a random number between 18 and 60', () => {

    for(let i=0;i<20;i++){
      let seged = generateRandomAge();
      expect(seged>=18 && seged<=60).to.deep.equal(true)
    }
  })
})

describe('isThereFreeSpace true', () => {
  it('should check if there are free spaces that people can move in', () => {

    expect(isThereFreeSpace()).to.deep.equal(true)
  })
})

describe('isUndefined false', () => {
  it('should check if given table and indexes are valid', () => {

    expect(isUndefined(gameTable,2,2)).to.deep.equal(false)
  })
})

describe('isUndefined true', () => {
  it('should check if given table and indexes are valid', () => {

    expect(isUndefined(gameTable,-2,-2)).to.deep.equal(true)
  })
})

function fullnessLive(chX,chY){
  let full = 0
  for (let i = 0; i < population.length; i++) {
    if (
      population[i].livingChordX == chX &&
      population[i].livingChordY == chY
    ) {
      full = full + 1;
    }
  }
  return full
}

function fullnessWork(chX,chY){
  let full = 0
  for (let i = 0; i < population.length; i++) {
    if (
      population[i].workChordX == chX &&
      population[i].workChordY == chY
    ) {
      full = full + 1;
    }
  }
  return full
}

describe('attemptToMoveIn', () => {
  it('should move a person in to the city', () => {

    isTutorial = false
    attemptToMoveIn(0)
    expect(fullnessLive(0,1)).to.deep.equal(1)
    expect(fullnessLive(5,1)==0 || fullnessLive(5,1)==1).to.deep.equal(true)
    expect(fullnessLive(5,3)==0 || fullnessLive(5,3)==1).to.deep.equal(true)
  })
})

describe('attemptToMoveIn untill full', () => {
  it('should move a person in to the city until it is full', () => {

    for(let i=0;i<49;i++){
      attemptToMoveIn(0)
    }
    
    expect(fullnessWork(5,1)).to.deep.equal(25)
    expect(fullnessWork(5,3)).to.deep.equal(25)
    expect(fullnessLive(0,1)).to.deep.equal(50)
  })
})

describe('attemptToMoveIn when full', () => {
  it('should not move a person in to the city', () => {

    for(let i=0;i<10;i++){
      attemptToMoveIn(0)
    }
    
    expect(fullnessWork(5,1)).to.deep.equal(25)
    expect(fullnessWork(5,3)).to.deep.equal(25)
    expect(fullnessLive(0,1)).to.deep.equal(50)
  })
})

describe('isThereFreeSpace false', () => {
  it('should check if there are free spaces that people can move in', () => {

    expect(isThereFreeSpace()).to.deep.equal(false)
  })
})


describe('upgradeResidental', () => {
  it('should upgrade the Residential area', () => {

    upgrade(0,1)
    expect(gameTable[0][1].capacity).to.deep.equal(50)
    upgrade(0,1)
    expect(gameTable[0][1].capacity).to.deep.equal(100)
    upgrade(0,1)
    expect(gameTable[0][1].capacity).to.deep.equal(150)
  })
})

describe('upgradeIndustrial', () => {
  it('should upgrade the Industrial area', () => {

    upgrade(5,1)
    expect(gameTable[5][1].capacity).to.deep.equal(25)
    upgrade(5,1)
    expect(gameTable[5][1].capacity).to.deep.equal(50)
    upgrade(5,1)
    expect(gameTable[5][1].capacity).to.deep.equal(75)
  })
})

describe('upgradeService', () => {
  it('should upgrade the Service area', () => {

    upgrade(5,3)
    expect(gameTable[5][3].capacity).to.deep.equal(25)
    upgrade(5,3)
    expect(gameTable[5][3].capacity).to.deep.equal(50)
    upgrade(5,3)
    expect(gameTable[5][3].capacity).to.deep.equal(75)
  })
})

describe('nyugdijasUpdate 64', () => {
  it('should make the 64 year old person retired', () => {

    attemptToMoveIn(64)
    expect(population[50].age).to.deep.equal(64)
    expect(population[50].nyugdijas).to.deep.equal(false)
    nyugdijasUpdate()
    expect(population[50].nyugdijas).to.deep.equal(true)
  })
})

describe('nyugdijasUpdate 100', () => {
  it('should make the 100 year old person dead and make an 18 year old move in', () => {

    attemptToMoveIn(100)
    expect(population[51].age).to.deep.equal(100)
    expect(population[51].nyugdijas).to.deep.equal(true)
    nyugdijasUpdate()
    expect(population[51].age).to.deep.equal(18)
    expect(population[51].nyugdijas).to.deep.equal(false)
  })
})

describe('yearPassed', () => {
  it('should subtract the maintenance costs from the budget', () => {

    let seged=money
    yearPassed()
    expect(money).to.deep.equal(seged-roadCostPerYear*6-polCostPerYear-fireCostPerYear-stadionCostPerYear-ado/2)
  })
})

describe('new18', () => {
  it('make a new 18 year old person move in the city', () => {

    attemptToMoveIn(18)
    expect(population[52].age).to.deep.equal(18)
  })
})

describe('periodicCatchOnFire', () => {
  it('should make a tile catch on fire', () => {

    gameTable[6][6] = new Residential("Residential", resCost, 0)
    gameTable[6][6].fireLikely=1
    upgrade(6,6)
    periodicCatchOnFire()
    expect(gameTable[6][6].isOnFire).to.deep.equal(1)
  })
})

describe('findClosestFireDp', () => {
  it('shoul check for closest Fire Department', () => {

    expect(findClosestFireDp(2,2)).to.deep.equal({i:2,j:3})
  })
})

describe('findAdjacentRoad', () => {
  it('should check for an adjecent Road', () => {

    expect(findAdjacentRoad(0,2)).to.deep.equal([1,2])
  })
})

describe('findAdjacentRoad wrong', () => {
  it('should check for an adjecent Road', () => {

    expect(findAdjacentRoad(-1,2)).to.deep.equal(null)
  })
})

describe('fireSpreadFrom wrong', () => {
  it('should not spread the fire onto the adjacent tiles', () => {

    fireSpreadFrom(6,6)
    expect(gameTable[6][5].isOnFire).to.deep.equal(0)
    expect(gameTable[6][7].isOnFire).to.deep.equal(0)
    expect(gameTable[5][6].isOnFire).to.deep.equal(0)
    expect(gameTable[7][6].isOnFire).to.deep.equal(0)
  })
})

describe('fireSpreadFrom', () => {
  it('should spread the fire onto the adjacent tiles', () => {

    gameTable[6][7] = new Residential("Residential", resCost, 0)
    upgrade(6,7)
    fireSpreadFrom(6,6)
    expect(gameTable[6][7].isOnFire).to.deep.equal(1)
  })
})

describe('dateGetter', () => {
  it('should return the date', () => {

    expect(dateGetter()).to.deep.equal(date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, "0")+"-"+date.getDate().toString().padStart(2, "0"))
  })
})

describe('inGameTimeManager days', () => {
  it('should increase the days after a day passes', () => {
    let seged = days
    inGameTimeManager()
    expect(days).to.deep.equal(seged+1)
  })
})

describe('inGameTimeManager week', () => {
  it('should reset the days to 0 after a week passes', () => {
    days = 6
    inGameTimeManager()
    expect(days).to.deep.equal(0)
  })
})

/*
describe('', () => {
  it('', () => {

    expect().to.deep.equal()
  })
})
*/
