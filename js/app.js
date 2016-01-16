
width = window.innerWidth;
height = window.innerHeight;

var img = new Image();
var drops = [];
var logo;

var drop0 = 300;
var drop_rate = drop0;
var growth0=1.09;
var growth= growth0;
var state = "calm";
var deluge = 0;
var context;
var pool = [];

var host = "tumblr";


var angle = 0;
var anglespeed = 0.3;

var basePitch = 110;
var drones = [];
var calmdrone = [];

var refresh_rate = 20000;

//2000 1.01  --> 4 drops

var MAX_ON_SCREEN = 10;
var num_drops = 0;

function Drop(src){
  this.src = src;
  this.x = 0;
  this.y = 0;
  this.rx = 30;
  this.ry = 30;

  this.image = src;
  $(this.image).addClass("drop");
  $("#flood").append(this.image);
}

Drop.prototype.update = function(){

  var $i = $(this.image);

  if(width>=height){
    this.rx *= growth;
    this.image.style.width = this.rx + "px";
    this.ry = $i.height();
    this.image.style.height= 'auto';
    this.image.style.opacity= Math.abs((this.rx-width*3)/(width*3));

    if(this.rx > width*2.5){
      // console.log('too big, removed');
      drops.splice(drops.indexOf(this),1);
      $(this.image).remove();
    }

  }else
  {
    this.ry *= growth;
    this.image.style.height= this.ry + "px";
    this.rx = $i.width()
      this.image.style.width= 'auto';
    this.image.style.opacity= Math.abs((this.ry-height*3)/(height*3));


    if(this.ry > height*3){
      // console.log('too big, removed');
      drops.splice(drops.indexOf(this),1);
      $(this.image).remove();
    }

  }


}

function render() {
  requestAnimationFrame(render);

  //logo

  //$(logo).css('left', width/2 - logo.width/2+"px");
  //$(logo).css('top', height/2 - logo.height/2+ "px");
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
  console.log(drop_rate);

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
  '2cars48.tumblr.com',
  'omgewbetch.tumblr.com',
  'nikeswooshes.tumblr.com',
  'david-bolin.tumblr.com',
  'batimientoscerebrales.tumblr.com',
  'goth5.tumblr.com',
  // 'xerui.tumblr.com',
  // 'furples.tumblr.com',
  // mikehottman.tumblr.com
  // olivegarden.tumblr.com
  ]

  function pickHost() {
    host = pickRandomProperty(data);
    while(data[host].length < 15 || $.inArray(host, blacklist) != -1 || countGoodImages(host) < 5) {
      delete data.host;
      host = pickRandomProperty(data);
    }
  }

function countGoodImages(host) {
  var count = 0;
  for (var i = 0; i < data[host].length; i++) {
    if(data[host][i].indexOf(".png") != -1 || data[host][i].indexOf(".gif") != -1) {
      count = count + 1;
    }
  }
  return count;
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
  var idx = Math.floor(Math.random()*arr.length);
  var element = arr[idx];
  // if(Math.random() < 0 || (element.indexOf(".png") == -1 && element.indexOf(".gif") == -1)) {
  //   return getRandomElement(arr);
  // }
  return element;
}

function createDrop(){
  if( num_drops < MAX_ON_SCREEN && state == "deluge"){
    var val = getRandomElement(pool);
    var d = new Drop(val);
    drops.push(d);
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
    host="tumblr";
  }
  deluge = 1;
});

var handleStart = function(e){
  e.preventDefault();
  deluge = 1;
}


var handleEnd = function(e){
  e.preventDefault();
  deluge = 0;
}

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
      host="tumblr";
    }
    deluge = 1;
    space = true;
  }
});


function getData(res) {
  $.getJSON("./data/data.js",function(response) {
    data = response;
    if(res) {
      res();
    }
  });
  setTimeout(function(){getData()},refresh_rate);
}

function pdefault(e){
    e.preventDefault()
}

function init(){

  var el = document.getElementById("flood");
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchstart", pdefault, false);
  el.addEventListener("touchend", pdefault, false);
  el.addEventListener("touchcancel", pdefault, false);
  el.addEventListener("touchleave", pdefault, false);
  el.addEventListener("touchmove", pdefault, false);

  logo = new Image();
  logo.src = "media/snake-logo-1.gif";
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


  var d = new Drone(basePitch*3, 0.5);
  calmdrone.push(d);

  var d  = new Drone(1.5 * basePitch*3, 0.4);
  calmdrone.push(d);

  var d  = new Drone(3*1.5 * basePitch*3, 0.4);
  calmdrone.push(d);





  setInterval(function(){

    if(deluge ==1){
      if(growth < 1.25){
        growth+=0.009
      }

      if(num_drops<4){
        drop_rate -=10;
      }else{
        drop_rate +=10;
      }
    }
    if(deluge ==0){
      if(growth > growth0){
        growth -=0.2;
      }

      if(drop_rate < drop0){
        drop_rate +=50;
      }
    }
  },500);


  render();
}



$(document).ready(function(){

  infoAlert();
  $("#loading").html("0%");
  checkFeatureSupport();
  var srcs = data.tumblr.map(function(v){return "media/"+v;});
  preloadImages(srcs, init);
});


var preloadImages = function(srcs, cb) {
    var loaded = 0;

    if (!preloadImages.cache) {
        preloadImages.cache = [];
    }
    var img;
    for (var i = 0; i < srcs.length; i++) {
        img = new Image();
        img.src = srcs[i];
        pool.push(img);
        img.onload = function(){
            loaded++;
            $("#loading").html(Math.ceil(loaded/srcs.length*100)+"%");
            if(loaded == srcs.length){
                $("#loading").remove();
                cb();
            }
        };
        preloadImages.cache.push(img);


    }
}

var checkFeatureSupport = function(){
  try{
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    if (iOS) {
        window.addEventListener('touchend', function() {
            var buffer = context.createBuffer(1, 1, 22050);
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
        }, false);
    }
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

var infoAlert = function(){
  alert("Web Warp \nRelax into the sensation and absorb the images as they arrive. Gently, then more rapidly, they will engulf you. Face the cascade, savor the flow.\n\nby Audrey Fox, Cameron Ketcham, Kawandeep Virdee, James Donovan.\nMade for ArtHackDay Deluge.");
}
