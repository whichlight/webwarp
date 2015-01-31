
width = window.innerWidth;
height = window.innerHeight;

var img = new Image();
var drops = [];

var drop_rate = 200;

var speed = 1.1;

function Drop(src){
  this.src = src;
  this.x = width/2;
  this.y = height/2;
  this.rx = 30;
  this.image = new Image();
  this.image.src = this.src;
  $(this.image).addClass("drop");
  $("#flood").append(this.image);
}

Drop.prototype.update = function(){

  var $i = $(this.image);

  this.rx *= speed;
  this.ry = $i.height()

  //visual
  $i.css('left', this.x - this.rx/2);
  $i.css('top', this.y - this.ry/2);
  this.image.style.width = this.rx + "px";
  this.image.style.height= 'auto';
  this.image.style.opacity= Math.abs((this.rx-width*2)/(width*2));

  //remove
  if(this.rx > width*2){
     console.log('too big, removed');
     drops.splice(drops.indexOf(this),1);
     $(this.image).remove();
  }
}

function render() {
  requestAnimationFrame(render);
  update();
}


function update(){
  drops.forEach(function(d){
    d.update();
  });
}

function getRandomElement(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function createDrop(){
  var val = getRandomElement(data);
  var src = "../media/" + val;
  var d = new Drop(src)
  drops.push(d);
  setTimeout(function(){createDrop()},drop_rate);
}

function init(){
  createDrop();
  render();
}

$(document).ready(function(){
  init();
});


