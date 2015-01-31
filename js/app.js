
width = window.innerWidth;
height = window.innerHeight;

var img = new Image();
var drops = [];
var logo;

var drop0 = 280;
var drop_rate = drop0;
var growth0=1.08;
var growth= growth0;
var state = "calm";
var deluge = 0;
var context;


var angle = 0;
var anglespeed = 0.3;

var basePitch = 110;
var drones = [];
var calmdrone = [];

//2000 1.01  --> 4 drops

var MAX_ON_SCREEN = 25;
var num_drops = 0;

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

  this.rx *= growth;
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

//logo

 $(logo).css('left', width/2 - logo.width/2+"px");
  $(logo).css('top', height/2 - logo.height/2+ "px");
   logo.style.webkitTransform = "rotate(-"+angle+"deg)";


  if(deluge ==0){
    angle +=anglespeed;
    angle %360;

    $(logo).fadeIn(1000);
    state = "calm";
    growth= growth0;
    drones.forEach(function(d){
      d.filter.frequency.value =100;
      d.stop();
    });

    calmdrone.forEach(function(d){
      d.filter.frequency.value =200;
      d.play();
    });




  }

  if(deluge ==1){
    angle=0;
    $(logo).hide();
    state = "deluge";
    drones.forEach(function(d){
      d.play();
      d.filter.frequency.value +=4;
    });

    calmdrone.forEach(function(d){
      d.stop();
    });




  }

  if (state == "calm"){
 //   $('img').remove();
  }

  update();


}


function update(){

  num_drops = $('.drop').length

  if(num_drops == 0){
    createDrop();
  }
  drops.forEach(function(d){
    d.update();
  });
}

function getRandomElement(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function createDrop(){

  if( num_drops < MAX_ON_SCREEN && state == "deluge"){
    var val = getRandomElement(data);
    var src = "../media/" + val;
    var d = new Drop(src)
      drops.push(d);
    console.log('create drop ' + $('.drop').length + ' drops now');
  setTimeout(function(){
    createDrop();
  },drop_rate);
  }
}




/*
$("#flood").click(function(){
  createDrop();
})
*/

$("#flood").mouseup(function(){
  deluge = 0;
});

$("#flood").mousedown(function(){
  deluge = 1;
});

$(document).keyup(function(evt) {
  if (evt.keyCode == 32) {
  deluge = 0;
    space = false;
  }
}).keydown(function(evt) {

  if (evt.keyCode == 32) {
  evt.stopPropagation();
   evt.preventDefault();
  deluge = 1;
    space = true;
  }
});


function init(){

  logo = new Image();
  logo.src = "../media/snake-logo-1.gif";
  $(logo).addClass("logo");
  logo.width = '200';
  $('#flood').append(logo);



  var d = new Drone(basePitch, 0.5);
  drones.push(d);

  var d  = new Drone(1.5 * basePitch, 0.5);
  drones.push(d);

  var d = new Drone(basePitch/2, 0.3);
  drones.push(d);



  var d = new Drone(basePitch*1.5*2, 0.2);
  drones.push(d);
  var d = new Drone(2*basePitch, 0.1);

  drones.push(d);


  var d = new Drone(basePitch*3, 0.8);
  calmdrone.push(d);

  var d  = new Drone(1.5 * basePitch*3, 0.8);
  calmdrone.push(d);

  var d  = new Drone(3*1.5 * basePitch*3, 0.8);
  calmdrone.push(d);




  setInterval(function(){

    console.log(growth, drop_rate, num_drops);
    if(deluge ==1){
      if(growth < 1.25){
        growth+=0.005
      }

      if(num_drops<8){
        drop_rate -=10;
      }else{
        drop_rate +=10;
      }
    }
    if(deluge ==0){
      if(growth > growth0){
        growth -=0.3;
      }

      if(drop_rate < drop0){
        drop_rate +=50;
      }
    }
  },500);


  render();
}



$(document).ready(function(){
  checkFeatureSupport();
  init();
});


var checkFeatureSupport = function(){
  try{
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch (err){
    alert('web audio not supported');
  }

  try{
    motionContext = window.DeviceMotionEvent;
  }
  catch (err){
    console.log('motion not supported');
  }
}
