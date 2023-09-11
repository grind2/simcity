let actualCityName = prompt(
  "Add meg a város Nevét: \nLehetőleg max 20 Karakterben!"
);
const roadCost = 40; // Cost of Road
const resCost = 10; // Cost of Zone
const indCost = 20; // Cost of Zone
const serCost = 30; // Cost of Zone
const polCost = 100; // Cost of Police
const fireCost = 200; // Cost of FireDp
const stadionCost = 300; // Cost of Stadium

const roadCostBack = -20; // Cost of Road Back, if Road is Destructed
const resCostBack = -5; // Cost of Zone Back, if zone is Destructed
const indCostBack = -10; // Cost of Zone Back, if zone is Destructed
const serCostBack = -15; // Cost of Zone Back, if zone is Destructed
const polCostBack = -50; // Cost of Police Back, if Police is Destructed
const fireCostBack = -100; // Cost of FireDp Back, if FireDp is Destructed
const stadionCostBack = -150; // Cost of Stadium Back, if Stadium is Destructed

const roadCostPerYear = 100; // Cost of each Road Yearly
const polCostPerYear = 700; // Cost of each Police Yearly
const fireCostPerYear = 40; // Cost of each FireDp Yearly
const stadionCostPerYear = 2000; // Cost of each Stadium Yearly

const roadBuildMenu = new PIXI.Sprite.from("icons/menubuttons/roadBuild.png");
const residentialMenu = new PIXI.Sprite.from(
  "icons/menubuttons/residential.png"
);
const industrialMenu = new PIXI.Sprite.from("icons/menubuttons/industrial.png");
const serviceMenu = new PIXI.Sprite.from("icons/menubuttons/service.png");
const policeBuildMenu = new PIXI.Sprite.from("icons/menubuttons/police.png");
const stadionBuildMenu = new PIXI.Sprite.from("icons/menubuttons/stadion.png");
const fireDpBuildMenu = new PIXI.Sprite.from("icons/menubuttons/fireDp.png");
const destructMenu = new PIXI.Sprite.from("icons/menubuttons/destruct.png");
const disasterMenu = new PIXI.Sprite.from("icons/menubuttons/disaster.png");
const upgradeMenu = new PIXI.Sprite.from("icons/menubuttons/upgrade.png");
const tuzoltoMenu = new PIXI.Sprite.from("icons/menubuttons/tuzolto.png");

let buttons = [];
buttons.push(roadBuildMenu);
buttons.push(residentialMenu);
buttons.push(industrialMenu);
buttons.push(serviceMenu);
buttons.push(policeBuildMenu);
buttons.push(fireDpBuildMenu);
buttons.push(stadionBuildMenu);
buttons.push(destructMenu);
buttons.push(disasterMenu);
buttons.push(upgradeMenu);
buttons.push(tuzoltoMenu);

const lowTax = new PIXI.Sprite.from("icons/lowTax.png");
const midTax = new PIXI.Sprite.from("icons/midTax.png");
const highTax = new PIXI.Sprite.from("icons/highTax.png");
let pressed = false;

// Selection Animation
const imageFrames = [];
for (let i = 0; i < 17; i++) {
  const texture = PIXI.Texture.from(
    `./icons/frame_animation/frame_${i}_delay-0.14s.png`
  );
  imageFrames.push(texture);
}
const frame = new PIXI.AnimatedSprite(imageFrames);

// FireTruck Animation
const ftFrames = [];
for (let i = 1; i < 51; i++) {
  const texture = PIXI.Texture.from(`./icons/ft_animation/ft_${i}.png`);
  ftFrames.push(texture);
}
const ft = new PIXI.AnimatedSprite(ftFrames);

let isTutorial = false;
let x = 0;
let y = 0;
let z = 0;
let w = 0;
let tax = 0;

class Person {
  constructor(
    happiness,
    age,
    nyugdijas,
    workplacetype,
    livingChordX,
    livingChordY,
    workChordX,
    workChordY,
    nyugdij
  ) {
    this.happiness = happiness;
    this.age = age;
    this.nyugdijas = nyugdijas;
    this.workplacetype = workplacetype;
    this.livingChordX = livingChordX;
    this.livingChordY = livingChordY;
    this.workChordX = workChordX;
    this.workChordY = workChordY;
    this.nyugdij = nyugdij;
  }

  toJSON() {
    return {
      ...this
    };
  }

  static fromJSON(json) {
    return new Person(
      json.happiness,
      json.age,
      json.nyugdijas,
      json.workplacetype,
      json.livingChordX,
      json.livingChordY,
      json.workChordX,
      json.workChordY,
      json.nyugdij
    );
  }


  isNearWorkPlace() {
    const dx = Math.abs(this.livingChordX - this.workChordX);
    const dy = Math.abs(this.livingChordY - this.workChordY);
    return dx <= 3 && dy <= 3;
  }
}

let population = [];

class Field {
  constructor(type) {
    this.type = type;
    this.safety = 0;
    this.fireLikely = 0;
    this.isOnFire = 0;
    this.isOnFireFor = 0;
    this.fireAnimation = null;
  }

  toJSON() {
    return {
      ...this,
    };
  }

  static fromJSON(json) {
    let field = new Field(json.type);
    field.safety = json.safety;
    field.fireLikely = json.fireLikely;
    field.isOnFire = json.isOnFire;
    field.isOnFireFor = json.isOnFireFor;
    field.fireAnimation = json.fireAnimation;
    return field;
  }

  displaytype() {
    console.log(this.type);
  }

  isNearByPolice(x, y) {
    for (let i = x - 3; i <= x + 3; i++) {
      for (let j = y - 3; j <= y + 3; j++) {
        if (isUndefined(gameTable, i, j) == false) {
          if (gameTable[i][j].type == "Police") {
            return true;
          }
        }
      }
    }
    return false;
  }

  isNearByIndustrial(x, y) {
    for (let i = x - 3; i <= x + 3; i++) {
      for (let j = y - 3; j <= y + 3; j++) {
        if (isUndefined(gameTable, i, j) == false) {
          if (gameTable[i][j].type == "Industrial") {
            return true;
          }
        }
      }
    }
    return false;
  }

  isNearByFireDp(x, y) {
    for (let i = x - 3; i <= x + 3; i++) {
      for (let j = y - 3; j <= y + 3; j++) {
        if (isUndefined(gameTable, i, j) == false) {
          if (gameTable[i][j].type == "FireDp") {
            return true;
          }
        }
      }
    }
    return false;
  }

  isNearByStadium(x, y) {
    for (let i = x - 3; i <= x + 3; i++) {
      for (let j = y - 3; j <= y + 3; j++) {
        if (isUndefined(gameTable, i, j) == false) {
          if (
            gameTable[i][j].type == "StadiumTL" ||
            gameTable[i][j].type == "StadiumTR" ||
            gameTable[i][j].type == "StadiumDL" ||
            gameTable[i][j].type == "StadiumDR"
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

class Road extends Field {
  constructor(type, cost) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
  }
}

// Osztályok létrehozása az UML-nek megfelelően
class Residential extends Field {
  constructor(type, cost, level) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
    this.level = level;
    this.capacity = 50;
    this.fullNess = 0;
    this.fireLikely = 0.03;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      cost: this.cost,
      level: this.level,
      capacity: this.capacity,
      fullNess: this.fullNess,
      fireLikely: this.fireLikely,
    };
  }

  static fromJSON(json) {
    let residential = new Residential(json.type, json.cost, json.level);
    residential.capacity = json.capacity;
    residential.fullNess = json.fullNess;
    residential.fireLikely = json.fireLikely;
    return residential;
  }

}
class Industrial extends Field {
  constructor(type, cost, level) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
    this.level = level;
    this.capacity = 25;
    this.fullNess = 0;
    this.fireLikely = 0.05;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      cost: this.cost,
      level: this.level,
      capacity: this.capacity,
      fullNess: this.fullNess,
      fireLikely: this.fireLikely,
    };
  }

  static fromJSON(json) {
    let industrial = new Industrial(json.type, json.cost, json.level);
    industrial.capacity = json.capacity;
    industrial.fullNess = json.fullNess;
    industrial.fireLikely = json.fireLikely;
    return industrial;
  }

}
class Service extends Field {
  constructor(type, cost, level) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
    this.level = level;
    this.capacity = 25;
    this.fullNess = 0;
    this.fireLikely = 0.03;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      cost: this.cost,
      level: this.level,
      capacity: this.capacity,
      fullNess: this.fullNess,
      fireLikely: this.fireLikely,
    };
  }

  static fromJSON(json) {
    let service = new Service(json.type, json.cost, json.level);
    service.capacity = json.capacity;
    service.fullNess = json.fullNess;
    service.fireLikely = json.fireLikely;
    return service;
  }

}

class Police extends Field {
  constructor(type, cost) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
  }
}
class FireDp extends Field {
  constructor(type, cost) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
  }
}
class StadiumTL extends Field {
  constructor(type, cost) {
    super(type);
    this.cost = cost;
    moneyUpdate(cost);
  }
}

class StadiumTR extends Field {}
class StadiumDL extends Field {}
class StadiumDR extends Field {}
let gameTable = [];

let clickedPlace = new Field("Field");

for (let i = 0; i < 10; i++) {
  gameTable[i] = [];

  for (let j = 0; j < 20; j++) {
    gameTable[i][j] = new Field("Field");
  }
}

let timeElapsed = 0;
let date = new Date();
let pickedSquare = null; 
let days = 0;
let prevYear = date.getFullYear();
let month = date.getMonth();
let mcounter = 0;

let money = 50000; //kezdőtőke
let happiness = 100; //boldogság
let times = 40; //mennyire gyors az idő
let goTimer = true; //mennyen-e az idő
let ado = 10000; //mivel még nincs adó (vagy csak idióta vagyok) addig nyugdíjban ezt használom

/**
 * Mentendő változókat JSON-be szerializálja, majd a localStorage-ba teszi
 * @param {string} cityName1 - megkapja a város nevét, majd ezzel a kulccsal tárolja
 */
function saveGame(cityName1) {
  const gameState = {
    cityName1,
    population: population.map(person => person.toJSON()),
    //gameTable: gameTable.map(field => field.toJSON()),
    gameTable: gameTable.map(row => row.map(field => {
      if (typeof field.toJSON !== 'function') {
        console.error('This object does not have a .toJSON method:', field);
        return null;
      }
      return field.toJSON();
    })),
    
    
    timeElapsed,
    date: date.toString(), 
    pickedSquare,
    days,
    prevYear,
    month,
    mcounter,
    money,
    happiness,
    times,
    goTimer,
    ado
  };

  localStorage.setItem(cityName1, JSON.stringify(gameState));
}

/**
 * Deszerializálja az adott kulcson található mentést, és azt beolvassa a játékba (aktívvá teszi)
 * @param {string} cityName1 - localStorage kulcs (város neve)
 */
function loadGame(cityName1) {
  const gameState = JSON.parse(localStorage.getItem(cityName1));

  actualCityName = gameState.cityName1;
  population = gameState.population.map(Person.fromJSON);
  gameTable = gameState.gameTable.map(row => row.map(fieldJson => {
    switch(fieldJson.type) {
      case 'road': return Road.fromJSON(fieldJson);
      case 'residential': return Residential.fromJSON(fieldJson);
      case 'industrial': return Industrial.fromJSON(fieldJson);
      case 'service': return Service.fromJSON(fieldJson);
      default: return Field.fromJSON(fieldJson);
    }
  }));
  timeElapsed = gameState.timeElapsed;
  date = new Date(gameState.date);
  pickedSquare = gameState.pickedSquare;
  days = gameState.days;
  prevYear = gameState.prevYear;
  month = gameState.month;
  mcounter = gameState.mcounter;
  money = gameState.money;
  happiness = gameState.happiness;
  times = gameState.times;
  goTimer = gameState.goTimer;
  ado = gameState.ado;
}




const price_of_lakozona = 1000;
const price_of_iparizona = 1500;
const price_of_szolgaltatasizona = 800;
const app = new PIXI.Application({
  width: 1000,
  height: 480,
  backgroundColor: 0xffffff,
});

let happyText = new PIXI.Text("Boldogság: " + happiness + "%", {
  fontFamily: "Arial",
  fontSize: 18,
  fill: 0x000000,
  align: "center",
});
happyText.anchor.set(0.5);
happyText.position.set(app.screen.width / 2.3, app.screen.height / 9);
app.stage.addChild(happyText);

const board = new PIXI.Container();
const squareSize = 40;

const cityName = new PIXI.Text(actualCityName, {
  fontFamily: "Arial",
  fontSize: 25,
});
cityName.anchor.set(0.5);
cityName.position.set(app.screen.width / 10, app.screen.height / 20);
app.stage.addChild(cityName);

const dateText = new PIXI.Text(getFormattedDate(), {
  fontFamily: "Arial",
  fontSize: 18,
  fill: 0x000000,
  align: "center",
});
dateText.anchor.set(0.5);
dateText.position.set(app.screen.width / 3.8, app.screen.height / 18);
app.stage.addChild(dateText);

let moneyText = new PIXI.Text("Pénz: " + money + "$", {
  fontFamily: "Arial",
  fontSize: 18,
  fill: 0x000000,
  align: "center",
});
moneyText.anchor.set(0.5);
moneyText.position.set(app.screen.width / 2.3, app.screen.height / 18);
app.stage.addChild(moneyText);

function moneyUpdate(amount) {
  money = money - amount;
  app.stage.removeChild(moneyText);
  if (money > 0) {
    const moneyText2 = new PIXI.Text("Pénz: " + money + "$", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0x000000,
      align: "center",
    });
    moneyText2.anchor.set(0.5);
    moneyText2.position.set(app.screen.width / 2.3, app.screen.height / 18);
    moneyText = moneyText2;
    app.stage.addChild(moneyText);
  } else {
    const moneyText2 = new PIXI.Text("Pénz: " + money + "$", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xff0000,
      align: "center",
    });
    moneyText2.anchor.set(0.5);
    moneyText2.position.set(app.screen.width / 2.3, app.screen.height / 18);
    moneyText = moneyText2;
    app.stage.addChild(moneyText);
  }
}

app.ticker.add(animate);
let fullNess = new PIXI.Text();

const buttonStop = new PIXI.Sprite.from("icons/pause.png");
buttonStop.anchor.set(0.5);
buttonStop.x = 215; //app.screen.width / 1;
buttonStop.y = 57; //app.screen.height / 1;
app.stage.addChild(buttonStop);
buttonStop.interactive = true;
buttonStop.on("mousedown", () => {
  goTimer = !goTimer;

  if (goTimer == true) {
    inGameTimeManager();
  }
});

const buttonSpeed1 = new PIXI.Sprite.from("icons/speed1.png");
buttonSpeed1.anchor.set(0.5);
buttonSpeed1.x = 250;
buttonSpeed1.y = 57;
buttonSpeed1.interactive = true;
app.stage.addChild(buttonSpeed1);
buttonSpeed1.on("mousedown", () => {
  times = 80;
  goTimer = true;
});

const buttonSpeed2 = new PIXI.Sprite.from("icons/speed2.png");
buttonSpeed2.anchor.set(0.5);
buttonSpeed2.x = 285;
buttonSpeed2.y = 57;
buttonSpeed2.interactive = true;
app.stage.addChild(buttonSpeed2);
buttonSpeed2.on("mousedown", () => {
  times = 40;
  goTimer = true;
});

const buttonSpeed3 = new PIXI.Sprite.from("icons/speed3.png");
buttonSpeed3.anchor.set(0.5);
buttonSpeed3.x = 320;
buttonSpeed3.y = 57;
buttonSpeed3.interactive = true;
app.stage.addChild(buttonSpeed3);
buttonSpeed3.on("mousedown", () => {
  times = 10;
  goTimer = true;
});

const buttonMeteor = new PIXI.Sprite.from("icons/meteorw.png");
buttonMeteor.anchor.set(0.5);
buttonMeteor.width = 70;
buttonMeteor.height = 70;
buttonMeteor.x = 950;
buttonMeteor.y = 40;
buttonMeteor.interactive = true;
app.stage.addChild(buttonMeteor);
buttonMeteor.on("mousedown", () => {
  meteorCatastrophe();
});

board.position.set(
  (app.screen.width - board.width) / 2,
  (app.screen.height - board.height) / 2
);

app.stage.addChild(board);
document.getElementById("game").appendChild(app.view);

// Menü Létrehozása //
const menuText = new PIXI.Text("Menü:", {
  fontFamily: "Arial",
  fontSize: 23,
});
menuText.anchor.set(0.5);
menuText.position.set(app.screen.width / 26, app.screen.height / 8);
app.stage.addChild(menuText);

//Functions

function statDisplay(chordX, chordY) {
  let counter = 0;
  app.stage.removeChild(fullNess);
  if (isUndefined(gameTable, chordX, chordY) == false) {
    if (gameTable[chordX][chordY].type == "Residential") {
      for (let i = 0; i < population.length; i++) {
        if (
          population[i].livingChordX == chordX &&
          population[i].livingChordY == chordY
        ) {
          counter = counter + 1;
        }
      }

      let fullNess2 = new PIXI.Text(
        "Telítettség: " +
          gameTable[chordX][chordY].capacity +
          " / " +
          counter +
          " Fő!",
        {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0x000000,
          align: "center",
        }
      );
      fullNess2.anchor.set(0.5);
      fullNess2.position.set(app.screen.width / 1.6, app.screen.height / 18);
      fullNess = fullNess2;
      app.stage.addChild(fullNess);
    }

    if (gameTable[chordX][chordY].type == "Industrial") {
      for (let i = 0; i < population.length; i++) {
        if (
          population[i].workChordX == chordX &&
          population[i].workChordY == chordY
        ) {
          counter = counter + 1;
        }
      }

      let fullNess2 = new PIXI.Text(
        "Telítettség: " +
          gameTable[chordX][chordY].capacity +
          " / " +
          counter +
          " Fő!",
        {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0x000000,
          align: "center",
        }
      );
      fullNess2.anchor.set(0.5);
      fullNess2.position.set(app.screen.width / 1.6, app.screen.height / 18);
      fullNess = fullNess2;
      app.stage.addChild(fullNess);
    }

    if (gameTable[chordX][chordY].type == "Service") {
      for (let i = 0; i < population.length; i++) {
        if (
          population[i].workChordX == chordX &&
          population[i].workChordY == chordY
        ) {
          counter = counter + 1;
        }
      }

      let fullNess2 = new PIXI.Text(
        "Telítettség: " +
          gameTable[chordX][chordY].capacity +
          " / " +
          counter +
          " Fő!",
        {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0x000000,
          align: "center",
        }
      );
      fullNess2.anchor.set(0.5);
      fullNess2.position.set(app.screen.width / 1.6, app.screen.height / 18);
      fullNess = fullNess2;
      app.stage.addChild(fullNess);
    }
  }
}

// minden zone 40% eséllyel kigyullad
function meteorCatastrophe() {
  setTimeout(() => {
    const meteorFrames = [];
    for (let i = 0; i < 18; i++) {
      const texture = PIXI.Texture.from(
        `./icons/meteor_animation/frame_${i}_delay-0.12s.gif`
      );
      meteorFrames.push(texture);
    }

    const meteorAnimation = new PIXI.AnimatedSprite(meteorFrames);

    meteorAnimation.position.set(x * squareSize + 200, y * squareSize + 80);
    meteorAnimation.width = 40 * 20;
    meteorAnimation.height = 40 * 10;
    meteorAnimation.animationSpeed = 0.2;
    meteorAnimation.loop = false;

    app.stage.addChild(meteorAnimation);
    meteorAnimation.play();
  }, 100);

  setTimeout(() => {
    let counter = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        if (
          (gameTable[i][j].type == "Service" ||
            gameTable[i][j].type == "Industrial" ||
            gameTable[i][j].type == "Residential" ||
            gameTable[i][j].type == "StadiumDL" ||
            gameTable[i][j].type == "StadiumDR" ||
            gameTable[i][j].type == "StadiumTL" ||
            gameTable[i][j].type == "StadiumTR" ||
            gameTable[i][j].type == "Police") &&
          gameTable[i][j].level != 0
        ) {
          counter++;

          if (Math.random() < 0.4) {
            gameTable[i][j].isOnFire = 1;
          }
        }
      }
    }
    texturesRefresh();
  }, 900);
}

function updateHappiness(a) {
  let tmp = 0;
  for (let i = 0; i < population.length; i++) {
    tmp = 0;
    let x = population[i].livingChordX;
    let y = population[i].livingChordY;

    if (gameTable[x][y].isNearByPolice(x, y) == true) {
      tmp = tmp + 30;
    }

    if (gameTable[x][y].isNearByFireDp(x, y) == true) {
      tmp = tmp + 30;
    }

    if (gameTable[x][y].isNearByStadium(x, y) == true) {
      tmp = tmp + 40;
    }

    if (gameTable[x][y].isNearByIndustrial(x, y) == true) {
      tmp = tmp - 20;
    }

    x = population[i].workChordX;
    y = population[i].workChordY;

    if (gameTable[x][y].isNearByPolice(x, y) == true) {
      tmp = tmp + 10;
    }

    if (population[i].isNearWorkPlace() == true) {
      tmp = tmp + 10;
    }

    if (tmp > 100) {
      tmp = 100;
    }
    if (tmp < 0) {
      tmp = 0;
    }

    population[i].happiness = tmp;
  }

  let sum = 0;
  for (let i = 0; i < population.length; i++) {
    sum = sum + population[i].happiness;
  }
  happiness = sum / population.length;
  happiness = Math.round(happiness) - a;

  if (happiness > 100) {
    happiness = 100;
  }
  if (happiness < 0) {
    happiness = 0;
  }
  if (isNaN(happiness)) {
    happiness = 0;
  }

  let happyText2 = new PIXI.Text("Boldogság: " + happiness + " %", {
    fontFamily: "Arial",
    fontSize: 18,
    fill: 0x000000,
    align: "center",
  });
  happyText2.anchor.set(0.5);
  happyText2.position.set(app.screen.width / 2.3, app.screen.height / 9);
  app.stage.removeChild(happyText);
  happyText = happyText2;
  app.stage.addChild(happyText);
}

function getFormattedDate() {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `Idő: ${year}-${month}-${day}`;
}

function animate(delta) {
  if (goTimer) {
    timeElapsed += delta;

    if (timeElapsed >= times) {
      date.setDate(date.getDate() + 1);
      dateText.text = getFormattedDate();
      timeElapsed = 0;
    }
  }
}

function texturesRefresh() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      if (gameTable[i][j].type == "Field") {
        const white = new PIXI.Sprite.from("icons/emptyFeher.png");
        const purple = new PIXI.Sprite.from("icons/emptyLila.png");
        const square = (i + j) % 2 === 0 ? white : purple;
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      // a tűzoltósághoz közel található blokkokon (max 3 blokknyira) 1%-ra redukálja a kigyulladás esélyét
      if (gameTable[i][j].isNearByFireDp(i, j)) {
        // console.log(i,j,"koordinátákon csökkent a kigyulladás esélye")
        gameTable[i][j].fireLikely = 0.01;
      }

      if (gameTable[i][j].isOnFire == 1) {
        catchOnFire(j, i);
      } else {
        app.stage.removeChild(gameTable[i][j].fireAnimation);
        gameTable[i][j].fireAnimation = null;
      }

      if (gameTable[i][j].type == "Road") {
        const square = new PIXI.Sprite.from("icons/Road.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      if (gameTable[i][j].type == "Residential") {
        if (gameTable[i][j].level == 0) {
          const square = new PIXI.Sprite.from("icons/zones/r.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 1) {
          const square = new PIXI.Sprite.from("icons/zones/r1.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 2) {
          const square = new PIXI.Sprite.from("icons/zones/r2.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 3) {
          const square = new PIXI.Sprite.from("icons/zones/r3.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }
      }

      if (gameTable[i][j].type == "Industrial") {
        if (gameTable[i][j].level == 0) {
          const square = new PIXI.Sprite.from("icons/zones/i.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 1) {
          const square = new PIXI.Sprite.from("icons/zones/i1.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 2) {
          const square = new PIXI.Sprite.from("icons/zones/i2.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 3) {
          const square = new PIXI.Sprite.from("icons/zones/i3.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }
      }

      if (gameTable[i][j].type == "Service") {
        if (gameTable[i][j].level == 0) {
          const square = new PIXI.Sprite.from("icons/zones/s.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 1) {
          const square = new PIXI.Sprite.from("icons/zones/s1.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 2) {
          const square = new PIXI.Sprite.from("icons/zones/s2.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }

        if (gameTable[i][j].level == 3) {
          const square = new PIXI.Sprite.from("icons/zones/s3.png");
          square.position.set(j * squareSize + 200, i * squareSize + 80);
          app.stage.addChild(square);
          square.interactive = true;
          square.buttonMode = true;
          square.selected = false;
          square.off("click").on("click", () => {
            z = i;
            w = j;
            clickedPlace = gameTable[i][j];
            menuDisplay(clickedPlace);
          });
        }
      }

      if (gameTable[i][j].type == "Police") {
        const square = new PIXI.Sprite.from("icons/Police.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      if (gameTable[i][j].type == "FireDp") {
        const square = new PIXI.Sprite.from("icons/FireDp.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      if (gameTable[i][j].type == "StadiumTL") {
        const square = new PIXI.Sprite.from("icons/StadiumTL.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      if (gameTable[i][j].type == "StadiumDL") {
        const square = new PIXI.Sprite.from("icons/StadiumDL.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      if (gameTable[i][j].type == "StadiumTR") {
        const square = new PIXI.Sprite.from("icons/StadiumTR.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }

      if (gameTable[i][j].type == "StadiumDR") {
        const square = new PIXI.Sprite.from("icons/StadiumDR.png");
        square.position.set(j * squareSize + 200, i * squareSize + 80);
        app.stage.addChild(square);
        square.interactive = true;
        square.buttonMode = true;
        square.selected = false;
        square.off("click").on("click", () => {
          z = i;
          w = j;
          clickedPlace = gameTable[i][j];
          menuDisplay(clickedPlace);
        });
      }
    }
  }
  // console.log(gameTable);
}

function menuDisplay(item) {
  // Előző MenüGombok Eltávolítása
  buttons.forEach((e) => {
    app.stage.removeChild(e);
  });
  statDisplay(z, w);

  //selection animation
  setTimeout(() => {
    frame.position.set(w * squareSize + 200, z * squareSize + 80);
    frame.width = 40;
    frame.height = 40;
    frame.animationSpeed = 0.14;
    app.stage.addChild(frame);
    frame.play();
  }, 10);

  switch (item.type) {
    case "Field":
      roadBuildMenu.anchor.set(0.5);
      roadBuildMenu.x = 100;
      roadBuildMenu.y = 100;
      roadBuildMenu.interactive = true;
      app.stage.addChild(roadBuildMenu);
      roadBuildMenu.off("click").on("click", () => {
        gameTable[z][w] = new Road("Road", 40);
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      residentialMenu.anchor.set(0.5);
      residentialMenu.x = 100;
      residentialMenu.y = 150;
      residentialMenu.interactive = true;
      app.stage.addChild(residentialMenu);
      residentialMenu.off("click").on("click", () => {
        gameTable[z][w] = new Residential("Residential", resCost, 0);
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      industrialMenu.anchor.set(0.5);
      industrialMenu.x = 100;
      industrialMenu.y = 200;
      industrialMenu.interactive = true;
      app.stage.addChild(industrialMenu);
      industrialMenu.off("click").on("click", () => {
        gameTable[z][w] = new Industrial("Industrial", indCost, 0);
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      serviceMenu.anchor.set(0.5);
      serviceMenu.x = 100;
      serviceMenu.y = 250;
      serviceMenu.interactive = true;
      app.stage.addChild(serviceMenu);
      serviceMenu.off("click").on("click", () => {
        gameTable[z][w] = new Service("Service", serCost, 0);
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      policeBuildMenu.anchor.set(0.5);
      policeBuildMenu.x = 100;
      policeBuildMenu.y = 300;
      policeBuildMenu.interactive = true;
      app.stage.addChild(policeBuildMenu);
      policeBuildMenu.off("click").on("click", () => {
        gameTable[z][w] = new Police("Police", polCost);
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      fireDpBuildMenu.anchor.set(0.5);
      fireDpBuildMenu.x = 100;
      fireDpBuildMenu.y = 350;
      fireDpBuildMenu.interactive = true;
      app.stage.addChild(fireDpBuildMenu);
      fireDpBuildMenu.off("click").on("click", () => {
        gameTable[z][w] = new FireDp("FireDp", fireCost);
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      stadionBuildMenu.anchor.set(0.5);
      stadionBuildMenu.x = 100;
      stadionBuildMenu.y = 400;
      stadionBuildMenu.interactive = true;
      app.stage.addChild(stadionBuildMenu);
      stadionBuildMenu.off("click").on("click", () => {
        if (
          z < 9 &&
          w < 19 &&
          gameTable[z][w].type == "Field" &&
          gameTable[z + 1][w].type == "Field" &&
          gameTable[z][w + 1].type == "Field" &&
          gameTable[z + 1][w + 1].type == "Field"
        ) {
          gameTable[z][w] = new StadiumTL("StadiumTL", stadionCost);
          gameTable[z + 1][w] = new StadiumDL("StadiumDL");
          gameTable[z][w + 1] = new StadiumTR("StadiumTR");
          gameTable[z + 1][w + 1] = new StadiumDR("StadiumDR");
          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        } else {
          alert("Ide nem lehet stadiont építeni");
        }
      });

      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 450;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        gameTable[z][w] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      break;

    case "Road":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        let tmpgameTable = JSON.parse(JSON.stringify(gameTable));
        tmpgameTable[z][w] = new Field("Field");
        if (areRoadsConnected(tmpgameTable) == false) {
          alert("Az út nem bontható el, mivel összekötettések szűnnének meg!");
          texturesRefresh();
        } else {
          moneyUpdate(roadCostBack);
          gameTable[z][w] = new Field("Field");
          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        }
      });
      break;

    case "Residential":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        moneyUpdate(resCostBack);
        gameTable[z][w] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      if (gameTable[z][w].level >= 0 && gameTable[z][w].level < 3) {
        upgradeMenu.anchor.set(0.5);
        upgradeMenu.x = 100;
        upgradeMenu.y = 150;
        upgradeMenu.interactive = true;
        app.stage.addChild(upgradeMenu);
        upgradeMenu.off("click").on("click", () => {
          upgrade(z, w);
          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      if (gameTable[z][w].level > 0 && gameTable[z][w].isOnFire == 1) {
        tuzoltoMenu.anchor.set(0.5);
        tuzoltoMenu.x = 100;
        tuzoltoMenu.y = 222;
        tuzoltoMenu.interactive = true;
        app.stage.addChild(tuzoltoMenu);
        tuzoltoMenu.off("click").on("click", () => {
          // i = y koordináta
          // j = x koordináta
          let closestCoordinates = findClosestFireDp(z, w);
          if (!closestCoordinates) {
            alert("Nem lehet eloltani a tüzet! :(");
            return -1;
          }
          let startPos = findAdjacentRoad(
            closestCoordinates.i,
            closestCoordinates.j
          );
          let endPos = findAdjacentRoad(z, w);

          if (closestCoordinates) {
            setTimeout(() => {
              fireTruckAnimation(
                startPos[1],
                startPos[0],
                endPos[1],
                endPos[0]
              );
            }, 100);
          }

          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      break;

    case "Industrial":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        moneyUpdate(indCostBack);
        gameTable[z][w] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      if (gameTable[z][w].level >= 0 && gameTable[z][w].level < 3) {
        upgradeMenu.anchor.set(0.5);
        upgradeMenu.x = 100;
        upgradeMenu.y = 150;
        upgradeMenu.interactive = true;
        app.stage.addChild(upgradeMenu);
        upgradeMenu.off("click").on("click", () => {
          upgrade(z, w);
          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      if (gameTable[z][w].level > 0 && gameTable[z][w].isOnFire == 1) {
        tuzoltoMenu.anchor.set(0.5);
        tuzoltoMenu.x = 100;
        tuzoltoMenu.y = 222;
        tuzoltoMenu.interactive = true;
        app.stage.addChild(tuzoltoMenu);
        tuzoltoMenu.off("click").on("click", () => {
          // i = y koordináta
          // j = x koordináta
          let closestCoordinates = findClosestFireDp(z, w);
          if (!closestCoordinates) {
            alert("Nem lehet eloltani a tüzet! :(");
            return -1;
          }
          let startPos = findAdjacentRoad(
            closestCoordinates.i,
            closestCoordinates.j
          );
          let endPos = findAdjacentRoad(z, w);

          if (closestCoordinates) {
            setTimeout(() => {
              fireTruckAnimation(
                startPos[1],
                startPos[0],
                endPos[1],
                endPos[0]
              );
            }, 100);
          }

          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      break;

    case "Service":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        moneyUpdate(serCostBack);
        gameTable[z][w] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      if (gameTable[z][w].level >= 0 && gameTable[z][w].level < 3) {
        upgradeMenu.anchor.set(0.5);
        upgradeMenu.x = 100;
        upgradeMenu.y = 150;
        upgradeMenu.interactive = true;
        app.stage.addChild(upgradeMenu);
        upgradeMenu.off("click").on("click", () => {
          upgrade(z, w);
          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      if (gameTable[z][w].level > 0 && gameTable[z][w].isOnFire == 1) {
        tuzoltoMenu.anchor.set(0.5);
        tuzoltoMenu.x = 100;
        tuzoltoMenu.y = 222;
        tuzoltoMenu.interactive = true;
        app.stage.addChild(tuzoltoMenu);
        tuzoltoMenu.off("click").on("click", () => {
          // i = y koordináta
          // j = x koordináta
          let closestCoordinates = findClosestFireDp(z, w);
          if (!closestCoordinates) {
            alert("Nem lehet eloltani a tüzet! :(");
            return -1;
          }
          let startPos = findAdjacentRoad(
            closestCoordinates.i,
            closestCoordinates.j
          );
          let endPos = findAdjacentRoad(z, w);

          if (closestCoordinates) {
            setTimeout(() => {
              fireTruckAnimation(
                startPos[1],
                startPos[0],
                endPos[1],
                endPos[0]
              );
            }, 100);
          }

          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      break;

    case "Police":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        moneyUpdate(polCostBack);
        gameTable[z][w] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      if (gameTable[z][w].isOnFire == 1) {
        tuzoltoMenu.anchor.set(0.5);
        tuzoltoMenu.x = 100;
        tuzoltoMenu.y = 222;
        tuzoltoMenu.interactive = true;
        app.stage.addChild(tuzoltoMenu);
        tuzoltoMenu.off("click").on("click", () => {
          // i = y koordináta
          // j = x koordináta
          let closestCoordinates = findClosestFireDp(z, w);
          if (!closestCoordinates) {
            alert("Nem lehet eloltani a tüzet! :(");
            return -1;
          }
          let startPos = findAdjacentRoad(
            closestCoordinates.i,
            closestCoordinates.j
          );
          let endPos = findAdjacentRoad(z, w);

          if (closestCoordinates) {
            setTimeout(() => {
              fireTruckAnimation(
                startPos[1],
                startPos[0],
                endPos[1],
                endPos[0]
              );
            }, 100);
          }

          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      break;

    case "FireDp":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        moneyUpdate(fireCostBack);
        gameTable[z][w] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      break;

    case "StadiumTL":
      destructMenu.anchor.set(0.5);
      destructMenu.x = 100;
      destructMenu.y = 100;
      destructMenu.interactive = true;
      app.stage.addChild(destructMenu);
      destructMenu.off("click").on("click", () => {
        moneyUpdate(stadionCostBack);
        gameTable[z][w] = new Field("Field");
        gameTable[z + 1][w] = new Field("Field");
        gameTable[z][w + 1] = new Field("Field");
        gameTable[z + 1][w + 1] = new Field("Field");
        texturesRefresh();
        menuDisplay(gameTable[z][w]);
        app.stage.removeChild(frame);
      });

      if (gameTable[z][w].isOnFire == 1) {
        tuzoltoMenu.anchor.set(0.5);
        tuzoltoMenu.x = 100;
        tuzoltoMenu.y = 222;
        tuzoltoMenu.interactive = true;
        app.stage.addChild(tuzoltoMenu);
        tuzoltoMenu.off("click").on("click", () => {
          // i = y koordináta
          // j = x koordináta
          let closestCoordinates = findClosestFireDp(z, w);
          if (!closestCoordinates) {
            alert("Nem lehet eloltani a tüzet! :(");
            return -1;
          }
          let startPos = findAdjacentRoad(
            closestCoordinates.i,
            closestCoordinates.j
          );
          let endPos = findAdjacentRoad(z, w);

          if (closestCoordinates) {
            setTimeout(() => {
              fireTruckAnimation(
                startPos[1],
                startPos[0],
                endPos[1],
                endPos[0]
              );
            }, 100);
          }

          setTimeout(() => {
            gameTable[z][w].isOnFire = 0;
            gameTable[z + 1][w].isOnFire = 0;
            gameTable[z][w + 1].isOnFire = 0;
            gameTable[z + 1][w + 1].isOnFire = 0;
          }, 200);

          texturesRefresh();
          menuDisplay(gameTable[z][w]);
          app.stage.removeChild(frame);
        });
      }

      break;
    default:
      console.log("Valami Nagyon nem jo....");
    // texturesRefresh();
  }
}

function tutorial() {
  let x0, y0, x1, y1, x2, y2;

  alert("Építs 5 db egymáshoz kapcsolódó utat!");
  app.stage.removeChild(frame);
  z = 100;
  w = 100;
  const button = document.createElement("button");
  const button2 = document.createElement("button");
  button.textContent = "Kész";
  button2.textContent = "Kész";
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        if (gameTable[i][j].type == "Road" && isConnectedToRoad(i, j)) {
          sum = sum + 1;
        }
      }
    }

    if (sum >= 2 && areRoadsConnected(gameTable)) {
      document.body.removeChild(button);
      alert(
        "Gratulálok! Most jelölj ki az Út mezők mellett legalább: \n 1 LakóZónát \n 1 IpariZónát \n 1 Szolgáltatási Zónát! \n (Az ipari zónát lehetőleg minél távolabb a lakótól)"
      );
      document.body.appendChild(button2);
      button2.addEventListener("click", () => {
        let res = 0;
        let ind = 0;
        let ser = 0;

        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 20; j++) {
            if (
              gameTable[i][j].type == "Residential" &&
              isConnectedToRoad(i, j)
            ) {
              res = res + 1;
            }
            if (
              gameTable[i][j].type == "Industrial" &&
              isConnectedToRoad(i, j)
            ) {
              ind = ind + 1;
            }
            if (gameTable[i][j].type == "Service" && isConnectedToRoad(i, j)) {
              ser = ser + 1;
            }
          }
        }

        if (res != 0 && ind != 0 && ser != 0) {
          alert(
            "Gratulálok Sikerült kijelölni a zónákat!\n A kezdeti népesség megérkezett a városba! \n Sok sikert a további városfejlesztéshez!"
          );

          for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
              if (
                gameTable[i][j].type == "Residential" &&
                isConnectedToRoad(i, j)
              ) {
                gameTable[i][j] = new Residential("Residential", resCost, 1);
                x0 = i;
                y0 = j;
              }
              if (
                gameTable[i][j].type == "Industrial" &&
                isConnectedToRoad(i, j)
              ) {
                gameTable[i][j] = new Industrial("Industrial", indCost, 1);
                x1 = i;
                y1 = j;
              }
              if (
                gameTable[i][j].type == "Service" &&
                isConnectedToRoad(i, j)
              ) {
                gameTable[i][j] = new Service("Service", serCost, 1);
                x2 = i;
                y2 = j;
              }
            }
          }
          texturesRefresh();
          document.body.removeChild(button2);

          for (let i = 0; i < 50; i++) {
            const age = generateRandomAge();

            if (i % 2 == 0) {
              let person = new Person(
                0,
                age,
                false,
                "Industrial",
                x0,
                y0,
                x1,
                y1,
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              );
              population.push(person);
            } else {
              let person = new Person(
                0,
                age,
                false,
                "Service",
                x0,
                y0,
                x2,
                y2,
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              );
              population.push(person);
            }
          }
          updateHappiness(0);
          isTutorial = false;
          fullNessUpdate();
        } else {
          alert(
            "Még nincs elég zóna kijelölve ahhoz, hogy a Kezdeti népesség megérkezzen a városodba!"
          );
        }
      });
    } else {
      alert(
        "Még nincs elég út a városban, vagy nem Összefüggő utat Építettél!"
      );
    }
  });
}

function isUndefined(_arr, _index1, _index2) {
  try {
    return _arr[_index1][_index2] == undefined;
  } catch (e) {
    return true;
  }
}

function isConnectedToRoad(i, j) {
  if (
    isUndefined(gameTable, i - 1, j) == false &&
    gameTable[i - 1][j].type == "Road"
  ) {
    return true;
  }

  if (
    isUndefined(gameTable, i + 1, j) == false &&
    gameTable[i + 1][j].type == "Road"
  ) {
    return true;
  }

  if (
    isUndefined(gameTable, i, j - 1) == false &&
    gameTable[i][j - 1].type == "Road"
  ) {
    return true;
  }

  if (
    isUndefined(gameTable, i, j + 1) == false &&
    gameTable[i][j + 1].type == "Road"
  ) {
    return true;
  }

  return false;
}

function areRoadsConnected(arr) {
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].type === "Road") {
        counter = counter + 1;
      }
    }
  }
  if (counter == 0) {
    return true;
  }

  let startPos = null;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].type === "Road") {
        startPos = [i, j];
        break;
      }
    }
    if (startPos !== null) {
      break;
    }
  }

  if (startPos === null) {
    return false;
  }

  const visited = new Set();
  const queue = [startPos];
  while (queue.length > 0) {
    const [i, j] = queue.shift();
    if (visited.has(`${i},${j}`)) {
      continue;
    }
    visited.add(`${i},${j}`);
    if (arr[i][j].type === "Road") {
      if (i > 0) {
        queue.push([i - 1, j]);
      }
      if (j > 0) {
        queue.push([i, j - 1]);
      }
      if (i < arr.length - 1) {
        queue.push([i + 1, j]);
      }
      if (j < arr[i].length - 1) {
        queue.push([i, j + 1]);
      }
    }
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].type === "Road" && !visited.has(`${i},${j}`)) {
        return false;
      }
    }
  }

  return true;
}
function generateRandomAge() {
  const minAge = 18;
  const maxAge = 60;

  return Math.floor(Math.random() * (maxAge - minAge + 1) + minAge);
}

function dateGetter() {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inGameTimeManager() {
  let yearurpassed = date.getFullYear() > prevYear;
  // Naponta Meghívódó rész!
  dayPassed();
  // console.log("Eltelt egy Nap!");

  //Hetente Meghívódó rész!
  days = days + 1;
  if (days % 7 == 0) {
    weekPassed();
    days = 0;
    // console.log("Eltelt egy Hét!");
    attemptToMoveIn(0);
  }

  //Havonta Meghívódó rész
  if (date.getMonth() > month) {
    month = date.getMonth();
    monthPassed();
    // console.log("Eltelt egy Hónap!");
  }

  // Évente meghívódó rész
  if (yearurpassed) {
    prevYear = date.getFullYear();
    yearPassed();
    // console.log("Eltelt egy Év!");
  }

  if (month == 11) {
    mcounter = mcounter + 1;
  }
  if (mcounter == 31) {
    month = -1;
    mcounter = 0;
  }
  if (goTimer) {
    setTimeout(inGameTimeManager, times * (100 / 6));
  }
}
function dayPassed() {
  updateHappiness(0);
}

function weekPassed() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      if (gameTable[i][j].isOnFire) {
        gameTable[i][j].isOnFireFor++;
      }

      // ha 4 hétig ég, akkor átterjed a környező épületekre
      if (gameTable[i][j].isOnFireFor == 4) {
        fireSpreadFrom(i, j);
      }

      // ha 8 hétig ég egy épület akkor megsemmisül
      if (gameTable[i][j].isOnFireFor == 8) {
        // console.log(i, j, "épület megsemmisül")
        gameTable[i][j].level = 0;
        gameTable[i][j].isOnFire = 0;
        gameTable[i][j].isOnFireFor = 0;
        app.stage.removeChild(gameTable[i][j].fireAnimation);
        gameTable[i][j].fireAnimation = null;
        if (
          gameTable[i][j].type == "StadiumDL" ||
          gameTable[i][j].type == "StadiumDR" ||
          gameTable[i][j].type == "StadiumTL" ||
          gameTable[i][j].type == "StadiumTR" ||
          gameTable[i][j].type == "Police"
        ) {
          gameTable[i][j].type = "Field";
        }
        setTimeout(() => {
          texturesRefresh();
        }, 100);
      }
    }
  }
}

function monthPassed() {
  //havonta 3% esély van katasztrófára
  if (Math.random < 0.03) {
    meteorCatastrophe();
  }
  periodicCatchOnFire();

  if (pressed == false) {
    app.stage.removeChild(lowTax, midTax, highTax);
  }

  adoSzedes();
}

function yearPassed() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      if (gameTable[i][j].type == "Road") {
        moneyUpdate(roadCostPerYear);
      }
      if (gameTable[i][j].type == "Police") {
        moneyUpdate(polCostPerYear);
      }
      if (gameTable[i][j].type == "FireDp") {
        moneyUpdate(fireCostPerYear);
      }
      if (gameTable[i][j].type == "StadiumTL") {
        moneyUpdate(stadionCostPerYear);
      }
    }
  }

  nyugdijasUpdate();
}

function upgrade(chordX, chordY) {
  gameTable[chordX][chordY].level += 1;
  if (gameTable[chordX][chordY].type == "Residential") {
    gameTable[chordX][chordY].capacity = gameTable[chordX][chordY].level * 50;
  } else {
    gameTable[chordX][chordY].capacity = gameTable[chordX][chordY].level * 25;
  }

  console.log(isThereFreeSpace());
}

function adoSzedes() {
  let a = 0;
  pressed = false;
  lowTax.anchor.set(0.5);
  lowTax.x = 575;
  lowTax.y = 57;
  lowTax.interactive = true;
  app.stage.addChild(lowTax);
  lowTax.off("click").on("click", () => {
    app.stage.removeChild(lowTax, midTax, highTax);
    pressed = true;
    moneyUpdate(-20000);
    a = 10;
    updateHappiness(a);
  });

  midTax.anchor.set(0.5);
  midTax.x = 700;
  midTax.y = 57;
  midTax.interactive = true;
  app.stage.addChild(midTax);
  midTax.off("click").on("click", () => {
    app.stage.removeChild(lowTax, midTax, highTax);
    pressed = true;
    moneyUpdate(-40000);
    a = 20;
    updateHappiness(a);
  });

  highTax.anchor.set(0.5);
  highTax.x = 825;
  highTax.y = 57;
  highTax.interactive = true;
  app.stage.addChild(highTax);
  app.stage.addChild(roadBuildMenu);
  highTax.off("click").on("click", () => {
    app.stage.removeChild(lowTax, midTax, highTax);
    pressed = true;
    moneyUpdate(-60000);
    a = 40;
    updateHappiness(a);
  });
  menuDisplay(clickedPlace);
}

function isThereFreeSpace() {
  let livingCap = 0;
  let workCap = 0;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      if (gameTable[i][j].type == "Residential") {
        livingCap = livingCap + gameTable[i][j].capacity;
      }

      if (
        gameTable[i][j].type == "Industrial" ||
        gameTable[i][j].type == "Service"
      ) {
        workCap = workCap + gameTable[i][j].capacity;
      }
    }
  }

  if (livingCap > population.length && workCap > population.length) {
    return true;
  } else {
    return false;
  }
}

function fullNessUpdate() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      for (let k = 0; k < population.length; k++) {
        if (gameTable[i][j].type == "Residential") {
          if (
            population[k].livingChordX == i &&
            population[k].livingChordY == j
          ) {
            gameTable[i][j].fullNess++;
          }
        }

        if (
          gameTable[i][j].type == "Industrial" ||
          gameTable[i][j].type == "Service"
        ) {
          if (population[k].workChordX == i && population[k].workChordY == j) {
            gameTable[i][j].fullNess++;
          }
        }
      }
    }
  }
}

function attemptToMoveIn(ages) {
  if (ages==18 || (isThereFreeSpace() && isTutorial == false)) {
    let industrialCounter = 0;
    let serviceCounter = 0;
    for (let i = 0; i < population.length; i++) {
      if (population[i].workplacetype == "Industrial") {
        industrialCounter++;
      }
      if (population[i].workplacetype == "Service") {
        serviceCounter++;
      }
    }
    let workplacetype = "Industrial";
    if (industrialCounter > serviceCounter) {
      workplacetype = "Service";
    }
    console.log(workplacetype);

    let x, y;
    let z = 50;
    let w = 50;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        if (
          gameTable[i][j].type == "Residential" &&
          gameTable[i][j].capacity > gameTable[i][j].fullNess
        ) {
          x = i;
          y = j;
        }
      }
    }

    if (workplacetype == "Industrial") {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 20; j++) {
          if (
            gameTable[i][j].type == "Industrial" &&
            gameTable[i][j].capacity > gameTable[i][j].fullNess
          ) {
            z = i;
            w = j;
          }
        }
      }
    }

    if (workplacetype == "Service") {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 20; j++) {
          if (
            gameTable[i][j].type == "Service" &&
            gameTable[i][j].capacity > gameTable[i][j].fullNess
          ) {
            z = i;
            w = j;
          }
        }
      }
    }

    if (z == 50 || w == 50) {
      console.log("Nincs Elég munkahely a beköltözéshez!");
    } else {
      const age = ages==18 ? 18 : ages==64 ? 64 : ages==100 ? 100 : generateRandomAge();
      const person = new Person(
        0,
        age,
        ages == 100 ? true : false,
        workplacetype,
        x,
        y,
        z,
        w,
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      console.log(person);
      population.push(person);
    }
  }
}

function nyugdijasUpdate() {
  for (let i = 0; i < population.length; i++) {
    population[i].age++;
    if (population[i].nyugdijas) {
      let minAge = 65;
      let maxAge = 100;

      if (
        Math.floor(Math.random() * (maxAge - minAge + 1) + minAge) <
        population[i].age
      ) {
        gameTable[population[i].livingChordX][population[i].livingChordY].fullNess--;
        population.splice(i,1);
        attemptToMoveIn(18);
      } else {
        population[i].nyugdij[prevYear % 10] = ado;
        let nyugdij = 0;
        let oszt = 0;
        for (let j = 0; j < 10; j++) {
          if (population[i].nyugdij[j] != 0) {
            nyugdij += population[i].nyugdij[j];
            oszt++;
          }
        }
        nyugdij = nyugdij / oszt / 2;
        moneyUpdate(nyugdij);
      }
    } else if (population[i].age == 65) {
      gameTable[population[i].workChordX][population[i].workChordY].fullNess--;
      population[i].nyugdijas = true;
      population[i].nyugdij[prevYear % 10] = ado;
      moneyUpdate(ado / 2);
    }
  }
}

/**
 * Meganimálja a tűzoltóautó mozgását (kizárólag úton), és eloltja a tüzet
 * @param {number} startX - kiindulási x koordináta
 * @param {number} startY - kiindulási y koordináta
 * @param {number} goalX - cél x koordináta
 * @param {number} goalY - cél y koordináta
 * @returns 
 */
function fireTruckAnimation(startX, startY, goalX, goalY) {
  if (
    gameTable[startY][startX].type != "Road" ||
    gameTable[goalY][goalX].type != "Road" ||
    !areRoadsConnected(gameTable)
  ) {
    console.log("nincs út");
    return -1;
  }

  ft.position.set(startX * squareSize + 200, startY * squareSize + 80);
  ft.width = 40;
  ft.height = 40;
  ft.animationSpeed = 0.6;
  // flipping (0 = left, 1 = right)

  let currentlyFlippedTo = 0;

  function flipping(direction) {
    if (direction) {
      if (currentlyFlippedTo != direction) {
        ft.scale.x = -1;
        ft.position.x += 40;
      }
    } else {
      if (currentlyFlippedTo != direction) {
        ft.scale.x = 1;
        ft.position.x -= 40;
      }
    }
  }

  if (startX < goalX) {
    flipping(1);
  }

  app.stage.addChild(ft);
  ft.play();

  let movedYet = false;
  async function moveSprite(startX, startY, goalX, goalY) {
    while (!(startX === goalX && startY === goalY)) {
      movedYet = false;
      //console.log(startX, startY);
      await new Promise((resolve) => setTimeout(resolve, times * 10));

      if (!movedYet) {
        if (startX < goalX && gameTable[startY][startX + 1].type == "Road") {
          startX++;
          ft.position.x += 40;
          movedYet = true;
        } else if (
          startX > goalX &&
          gameTable[startY][startX - 1].type == "Road"
        ) {
          startX--;
          ft.position.x -= 40;
          movedYet = true;
        }
      }

      if (!movedYet) {
        if (startY < goalY && gameTable[startY + 1][startX].type == "Road") {
          startY++;
          ft.position.y += 40;
          movedYet = true;
        } else if (
          startY > goalY &&
          gameTable[startY - 1][startX].type == "Road"
        ) {
          startY--;
          ft.position.y -= 40;
          movedYet = true;
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, times * 10));

    app.stage.removeChild(ft);
    console.log("eloltom a tuzet");
    gameTable[z][w].isOnFire = 0;
    texturesRefresh();
  }

  moveSprite(startX, startY, goalX, goalY);
}
/**
 * Meganimálja a mező(k) kigyulladását
 * @param {number} x 
 * @param {number} y 
 */
function catchOnFire(x, y) {
  setTimeout(() => {
    const fireFrames = [];
    for (let i = 0; i < 6; i++) {
      const texture = PIXI.Texture.from(
        `./icons/fire_animation/frame_${i}_delay-0.1s.gif`
      );
      fireFrames.push(texture);
    }

    const fireAnimation = new PIXI.AnimatedSprite(fireFrames);

    fireAnimation.position.set(x * squareSize + 200, y * squareSize + 80);
    fireAnimation.width = 40;
    fireAnimation.height = 40;
    fireAnimation.animationSpeed = 0.2;

    app.stage.addChild(fireAnimation);
    fireAnimation.play();

    gameTable[y][x].fireAnimation = fireAnimation;
  }, 100);
}

/**
 * Az indusztriális mezők kigyulladási esélye 5%, a többi zónamezőjé 3%.
 * Havonta ismételgetjük a függvényt.
 */
function periodicCatchOnFire() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      if (
        Math.random() < gameTable[i][j].fireLikely &&
        (gameTable[i][j].type == "Service" ||
          gameTable[i][j].type == "Industrial" ||
          gameTable[i][j].type == "Residential" ||
          gameTable[i][j].type == "StadiumDL" ||
          gameTable[i][j].type == "StadiumDR" ||
          gameTable[i][j].type == "StadiumTL" ||
          gameTable[i][j].type == "StadiumTR" ||
          gameTable[i][j].type == "Police") &&
        gameTable[i][j].level != 0
      ) {
        console.log("periodikus tűz ütött ki");
        gameTable[i][j].isOnFire = 1;
        texturesRefresh();
      }
    }
  }
}

/**
 * Megkeresi a legközelebbi tűzoltóságot. Úttestekre fogjuk használni.
 * @param {number} i1
 * @param {number} j1
 * @returns {number, number} - OR {NULL} ha nincs tűzoltóság.
 */
function findClosestFireDp(i1, j1) {
  let minDistance = Infinity;
  let closestTwo = null;

  for (let i = 0; i < gameTable.length; i++) {
    for (let j = 0; j < gameTable[i].length; j++) {
      if (gameTable[i][j].type == "FireDp") {
        let dx = i1 - i;
        let dy = j1 - j;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          closestTwo = { i, j };
        }
      }
    }
  }

  return closestTwo;
}
// setTimeout(() => { console.log(findClosestFireDp(0, 0)); }, 10000);

// A paraméterűl kapott koordinátákhoz visszaadja egy szomszédos mező koordinátáit, amin van út.
function findAdjacentRoad(i, j) {
  if (i < 0 || j < 0 || i >= gameTable.length || j >= gameTable[0].length) {
    return null;
  }

  const adjacentPositions = [
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
    [i, j - 1],
  ];

  for (let pos of adjacentPositions) {
    let [x, y] = pos;

    if (
      x >= 0 &&
      y >= 0 &&
      x < gameTable.length &&
      y < gameTable[0].length &&
      gameTable[x][y].type === "Road"
    ) {
      return pos;
    }
  }

  return null;
}

function fireSpreadHelper(x, y) {
  if (
    (gameTable[x][y].type == "Service" ||
      gameTable[x][y].type == "Industrial" ||
      gameTable[x][y].type == "Residential" ||
      gameTable[x][y].type == "StadiumDL" ||
      gameTable[x][y].type == "StadiumDR" ||
      gameTable[x][y].type == "StadiumTL" ||
      gameTable[x][y].type == "StadiumTR" ||
      gameTable[x][y].type == "Police") &&
    gameTable[x][y].level != 0
  ) {
    gameTable[x][y].isOnFire = 1;
  }
};

/**
 * A paraméterként kapott koordináták szomszédos mezőit (is) felgyújtja
 * @param {number} x 
 * @param {number} y 
 */
function fireSpreadFrom(x, y) {
  if (x > 0) {
    fireSpreadHelper(x - 1, y);
  }

  if (y > 0) {
    fireSpreadHelper(x, y - 1);
  }

  if (x < 19) {
    fireSpreadHelper(x + 1, y);
  }
  if (y < 9) {
    fireSpreadHelper(x, y + 1);
  }
  texturesRefresh();
}

// Játékmentések (városok neveivel)
let keys = Object.keys(localStorage);

/**
 * Mentés és betöltés gombok elhelyezése, funkcionalitás hozzáadása
 */
function footerButtons(){

  const loading = document.createElement("button");
  const save = document.createElement("button");
  loading.textContent = "Betöltés";
  save.textContent = "Mentés";
  document.getElementById("saving").appendChild(loading);
  document.getElementById("saving").appendChild(save);
  loading.addEventListener("click", () => {
    let toLoad = prompt(
      "Add meg a betölteni kívánt város nevét!\n" + keys
    );

    if(!keys.includes(toLoad)){
      toLoad = prompt(
        "Hibás városnév, próbáld újra! Mentett városok:\n" + keys 
      );
    }

    loadGame(toLoad); 
    cityName.text = actualCityName;
    moneyText.text = "Pénz: " + money + "$";
    happyText.text = "Boldogság: " + happiness + "%";
    texturesRefresh();
  });
  save.addEventListener("click", () => {
    saveGame(actualCityName);
    alert("A játék elmentve "+actualCityName+" néven.")
    keys = Object.keys(localStorage);
  });
}
footerButtons();

inGameTimeManager();
// tutorial();
texturesRefresh();
menuDisplay(clickedPlace);
