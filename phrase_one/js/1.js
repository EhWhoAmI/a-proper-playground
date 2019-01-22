const grid = [10,10];
const canvasx = grid[0]*50;
const canvasy = grid[1]*50;
var foods = [];
var bots = [];
var generation = [];
var gencounter = 0;
var worldmap = new Array(grid[0]*grid[1]).fill(0);
const arrSum = arr => arr.reduce((a,b) => a + b, 0)


function setup() {
  createCanvas(canvasx,canvasy);

  button1 = createButton('Add Food');
  button1.position(8, canvasy+16)
  button1.class('button');
  button1.mouseClicked(addfood);

  button2 = createButton('Add Random Bot');
  button2.position(150, canvasy+16)
  button2.class('button');
  button2.mouseClicked(addbot);

  button3 = createButton('Add 10 Random Bot');
  button3.position(358, canvasy+16)
  button3.class('button');
  button3.mouseClicked(add10bot);
  
  button5 = createButton('Add Inherit Bot');
  button5.position(150, canvasy+63);
  button5.class('button');
  button5.mouseClicked(addIbot);

  button6 = createButton('Add 10 Inherit Bot');
  button6.position(358, canvasy+63);
  button6.class('button');
  button6.mouseClicked(add10Ibot);

  button4 = createButton('Next Gen');
  button4.position(515, 8);
  button4.class('button');
  button4.mouseClicked(nextGen);

  infoboard = createElement('p','testing').position(516,90);

  noStroke();
}
//////////////////////////////////////////////////////////////////////////
function draw() {

  frameRate(10);
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
    this.botinput = worldmap.slice();
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
    this.botinput = worldmap.slice();
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
  for (i00=0;i00<10;i00++) {
    foods.push(new food());
    foods[foods.length-1].init();
  }
  delete i00;
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

function addIbot() {
  bots.push(new bot());
  bots[bots.length-1].init();
  bots[bots.length-1].brain.loadbrain(generation[Math.floor(Math.random() * generation.length)].brain);
}

function add10Ibot() {
  for (i00=0;i00<10;i00++) {
    addIbot();
  }
}

function worldrun1() {
  for (b in bots) {
    bots[b].hunger -= 10;
    for (f in foods) {
      if (bots[b].x == foods[f].x && bots[b].y == foods[f].y) {
        foods.splice(f, 1);
        bots[b].hunger += 50;
        bots[b].brain.reward = 1000;
        bots[b].brain.totalreward += 1000;
      }}
    if (bots[b].hunger <= 0) {
      generation.push(bots[b]);
      bots.splice(b,1);
      }
    }
}

function worldrun2() {
  for (x1=0;x1<grid[0];x1++) {
    for (y1=0;y1<grid[1];y1++) {
      //if nothing
      if (String(get(x1*50,y1*50)) == String([179, 179, 179, 255])) {
        worldmap.splice(y1*grid[0]+x1,1,0);
      }
      //if food
      else if (String(get(x1*50,y1*50)) == String([255, 0, 0, 255])) {
        worldmap.splice(y1*grid[0]+x1,1,3);
      }
      //if bot
      else if (String(get(x1*50,y1*50)) == String([0, 0, 0, 255])) {
        worldmap.splice(y1*grid[0]+x1,1,3);  
      }
    }
  }
  delete x1;
  delete y1;
}


//Nerual Network
function neuron() {
  this.init = function(input) {
    this.w = Math.random()*2-1;
    this.b = Math.random()*2-1;
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
  this.loadbrain = function(brain) {
    for (eachlayer=0;eachlayer<brain.dimension.length;eachlayer++) {
      for (eachneuron=0;eachneuron<brain.layer[eachlayer].numofneuron;eachneuron++) {
        this.layer[eachlayer].neuron[eachneuron].w = brain.layer[eachlayer].neuron[eachneuron].w;
        this.layer[eachlayer].neuron[eachneuron].b = brain.layer[eachlayer].neuron[eachneuron].b;
      }
    }
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
        this.layer[l].neuron[n].w += rate * this.reward;
        this.layer[l].neuron[n].b += rate * this.reward;
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
    'Number of Foods:  '+numoffood+'<br>'+
    'Generation:  '+gencounter+'<br>'
  );
}

function nextGen(){
  //selection
  basepointer = 0;
  selectionpointer = 0;
  while (generation.length > 10) {
    if (generation[basepointer].totalreward > generation[selectionpointer].totalreward) {
      generation.splice(selectionpointer,1);
    }
    else {
      generation.splice(basepointer,1);
    }
    selectionpointer+=1;
  }
  //selection ends
  gencounter += 1;
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