
width = window.innerWidth;
height = window.innerHeight;

var img = new Image();
var drops = [];

var drop0 = 350;
var drop_rate = drop0;
var growth0=1.08;
var growth= growth0;
var state = "calm";
var deluge = 0;

var refresh_rate = 20000;

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
     // console.log('too big, removed');
     drops.splice(drops.indexOf(this),1);
     $(this.image).remove();
  }
}

function render() {
  requestAnimationFrame(render);

  if(deluge ==0){
    state = "calm";
    growth= growth0;
  }

  if(deluge ==1){
    state = "deluge";

  }

  if (state == "calm"){
 //   $('img').remove();
  }

  update();


}


function update(){

  num_drops = $('img').length

  if(num_drops == 0){
    createDrop();
  }
  drops.forEach(function(d){
    d.update();
  });
}

blacklist = [
  'www.tumblr.com',
  'dednewb.tumblr.com',
  'kendrickxlamar.tumblr.com',
  'hellyeahrihannafenty.tumblr.com',
  // 'xerui.tumblr.com',
  // 'furples.tumblr.com',
  // mikehottman.tumblr.com
  // olivegarden.tumblr.com
]

function pickHost() {
  host = pickRandomProperty(data);
  while(data[host].length < 10 || $.inArray(host, blacklist) == 0) {
    delete data.host;
    host = pickRandomProperty(data);
  }
  console.log(host);
  console.log(data[host].length)
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function getRandomElement(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function createDrop(){

  if( num_drops < MAX_ON_SCREEN && state == "deluge"){
    var val = getRandomElement(data[host]);
    var src = "media/" + val;
    var d = new Drop(src)
      drops.push(d);
    // console.log('create drop ' + $('img').length + ' drops now');
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
  if (deluge == 0) {
    pickHost();
  }
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
     if (deluge == 0) {
    pickHost();
  }
  deluge = 1;
    space = true;
  }
});


function getData(res) {
  $.getJSON("http://localhost:8080/data/data.js",function(response) {
    data = response;
    if(res) {
      res();
    }
  });
  setTimeout(function(){getData()},refresh_rate);
}

function init(){
  pickHost();
  render();

  setInterval(function(){

  // console.log(growth, drop_rate, num_drops);
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
}



$(document).ready(function(){
  getData(init);
});


