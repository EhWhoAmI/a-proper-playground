const grid = [10,10];
const canvasx = grid[0]*50;
const canvasy = grid[1]*50;
var foods = [];
var bots = [];
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
}
//////////////////////////////////////////////////////////////////////////
function draw() {

  frameRate(6)
  background('#b3b3b3');
  worldrun();

  for (i in foods) {
    foods[i].show();
  }

  for (i in bots) {
    bots[i].move();
    bots[i].show();
  }

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

function worldrun() {
  for (b in bots) {
    bots[b].hunger -= 10;
    for (f in foods) {
      if (bots[b].x == foods[f].x && bots[b].y == foods[f].y) {
        foods.splice(f, 1);
        bots[b].hunger += 50;
      }}
    if (bots[b].hunger <= 0) {
      bots.splice(b,1);
      }}}