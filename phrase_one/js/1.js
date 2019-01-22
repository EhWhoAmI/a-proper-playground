const grid = [10,10];
const canvasx = grid[0]*50;
const canvasy = grid[1]*50;
var foods = [];
var bots = [];
var worldmap = new Array(grid[0]*grid[1]).fill(0);
const arrSum = arr => arr.reduce((a,b) => a + b, 0)

function setup() {
  createCanvas(canvasx,canvasy);

  button1 = createButton('Add Food');
  button1.position(8, canvasy+16)
  button1.class('button');
  button1.mouseClicked(addfood);

  button2 = createButton('Add Bot');
  button2.position(150, canvasy+16)
  button2.class('button');
  button2.mouseClicked(addbot);

  var nn1 = new network();
  nn1.init([1,1]);
  nn1.fp();
  noStroke();
}
//////////////////////////////////////////////////////////////////////////
function draw() {

  frameRate(6)
  background('#b3b3b3');
  worldrun1();

  for (i in foods) {
    foods[i].show();
  }

  for (i in bots) {
    bots[i].move();
    bots[i].show();
  }

  worldrun2();

}
//////////////////////////////////////////////////////////////////////////
function food() {
  this.init = function() {
    this.x = Math.floor(Math.random() * grid[0]);
    this.y = Math.floor(Math.random() * grid[1]);
    this.location = [this.x*50,this.y*50];
  }
  this.show = function() {
    fill('red')
    rect(this.location[0],this.location[1],50,50);
  }
}

function bot() {
  this.init = function() {
    this.x = Math.floor(Math.random() * grid[0]);
    this.y = Math.floor(Math.random() * grid[1]);
    this.location = [this.x*50,this.y*50];
    this.hunger = 100;
  }
  this.show = function() {
    fill('black')
    rect(this.location[0],this.location[1],50,50);
  }
  this.move = function() {
    this.x += 1;
    this.location = [this.x*50,this.y*50];
    this.hunger -= 5;
  }
}

function addfood() {
  foods.push(new food());
  foods[foods.length-1].init();

}

function addbot() {
  bots.push(new bot());
  bots[bots.length-1].init();
}

function worldrun1() {
  for (b in bots) {
    bots[b].hunger -= 10;
    for (f in foods) {
      if (bots[b].x == foods[f].x && bots[b].y == foods[f].y) {
        foods.splice(f, 1);
        bots[b].hunger += 50;
      }}
    if (bots[b].hunger <= 0) {
      bots.splice(b,1);
      }
    }
}

function worldrun2() {
  for (x=0;x<grid[0];x++) {
    for (y=0;y<grid[1];y++) {
      //if nothing
      if (String(get(x*50,y*50)) == String([179, 179, 179, 255])) {
        worldmap[y*grid[0]+x] = 0;
      }
      //if food
      else if (String(get(x*50,y*50)) == String([255, 0, 0, 255])) {
        worldmap[y*grid[0]+x] = 2;
      }
      //if bot
      else if (String(get(x*50,y*50)) == String([0, 0, 0, 255])) {
        worldmap[y*grid[0]+x] = 3;
      }
    }
  }
}


//Nerual Network
function neuron() {
  this.init = function(input) {
    this.w = Math.random();
    this.b = Math.random();
    this.activation = 'sigmoid';
    this.input = input;
    this.output;
  }
  this.activate = function(activation) {
    if (activation == 'sigmoid') {
      this.output = 1 / (1 + Math.E ** -this.output);
    }
  }
  this.fp = function() {
    this.output = 0
    this.output += this.w * arrSum(this.input) + this.b;
    this.activate(this.activation);
  }
}

function layer() {
  this.init = function(inputlayer,numofneuron) {
    this.inputlayer = inputlayer;
    this.numofneuron = numofneuron;
    this.neuron = [];
    this.outputlayer;
    for (i=0;i<this.numofneuron;i++) {
      this.neuron.push(new neuron())
      this.neuron[this.neuron.length-1].init(inputlayer);
    }
  }
  this.fp = function() {
    this.outputlayer = [];
    for (i=0;i<this.numofneuron;i++) {
      this.neuron[i].fp();
      this.outputlayer.push(this.neuron[i].output);
    }
  }
}

function network() {
  this.init = function(dimension) {
    this.dimension = dimension;
    this.layer = [];
    this.inputdata;
    this.output;
    for (i2=0;i2<(this.dimension.length);i2+=1) {
      this.layer.push(new layer())
      this.layer[this.layer.length-1].init([1],this.dimension[i2]);
    }
  }
  this.loaddata = function(data) {
    this.inputdata = data;
  }
  this.fp = function() {
    for (i3=0;i3<this.layer.length;i3++) {
      this.layer[i3].fp();
    }
    this.output = this.layer[this.layer.length-1].outputlayer;
  }
}