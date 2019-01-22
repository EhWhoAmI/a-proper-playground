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

  button3 = createButton('Add 10 Bot');
  button3.position(276, canvasy+16)
  button3.class('button');
  button3.mouseClicked(add10bot);

  infoboard = createElement('p','testing').position(8,550);

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

  for (i0 in bots) {
    bots[i0].move();
    bots[i0].show();
    bots[i0].brain.learn(0.001);
  }

  infoupdate(); //updates info board
  worldrun2(); //updates worldmap

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
    this.botinput = worldmap;
    this.botinput.push(this.x);
    this.botinput.push(this.y);
    this.brain = new network()
    this.brain.init([5])
  }
  this.show = function() {
    fill('black')
    rect(this.location[0],this.location[1],50,50);
  }
  this.update = function() {
    this.botinput = worldmap;
    this.botinput.push(this.x);
    this.botinput.push(this.y);
    this.brain.loaddata(this.botinput);
    this.brain.fp();
  }
  this.action = function() {
    this.update();
    this.actionid = indexOfMax(this.brain.output);
    if (this.actionid == 0 && this.x < 9) {
      this.x += 1;
      this.hunger -= 5;
      this.brain.reward = -1;
      this.brain.totalreward -= 1;
    }
    else if (this.actionid == 1 && this.x > 0) {
      this.x -= 1;
      this.hunger -= 5;
      this.brain.reward = -1;
      this.brain.totalreward -= 1;
    }
    else if (this.actionid == 2 && this.y < 9) {
      this.y += 1;
      this.hunger -= 5;
      this.brain.reward = -1;
      this.brain.totalreward -= 1;
    }
    else if (this.actionid == 3 && this.y > 0) {
      this.y -= 1;
      this.hunger -= 5;
      this.brain.reward = -1;
      this.brain.totalreward -= 1;
    }
    else if (this.actionid == 4) {
      this.brain.reward = -1
      this.brain.totalreward -= 1;
    
    }
  }
  this.move = function() {
    this.action();
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

function add10bot() {
  for (i00=0;i00<10;i00++) {
    addbot();
  }
}

function worldrun1() {
  for (b in bots) {
    bots[b].hunger -= 10;
    for (f in foods) {
      if (bots[b].x == foods[f].x && bots[b].y == foods[f].y) {
        foods.splice(f, 1);
        bots[b].hunger += 50;
        bots[b].brain.reward = 10;
        bots[b].brain.totalreward += 10;
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
    this.reward = 0;
    this.totalreward = 0;
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
  this.learn = function(rate) {
    for (l=0;l<this.dimension.length;l++) {
      for (n=0;n<this.layer[l].numofneuron;n++) {
        this.layer[l].neuron[n].w *= rate * this.reward;
        this.layer[l].neuron[n].b *= rate * this.reward;
      }
    }
  }
  }

//Neural Network Ends

function infoupdate() {
  numofbot = bots.length;
  numoffood = foods.length;
  infoboard.html(
    'Number of Bots:  '+numofbot+'<br>'+
    'Number of Foods:  '+numoffood+'<br>'
  );
}

function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}