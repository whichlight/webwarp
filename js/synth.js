function Drone(freq,vol){
  this.filter;
  this.gain;
  this.osc;
  this.played = false;
  this.volume = vol;
  this.pitch = freq;
  this.buildSynth();
}

Drone.prototype.buildSynth = function(){
  this.osc = context.createOscillator(); // Create sound source
  this.osc.type = "sawtooth";
  this.osc.frequency.value = this.pitch;

  this.filter = context.createBiquadFilter();
  this.filter.type = "lowpass";
  this.filter.frequency.value = 2000;

  this.gain = context.createGain();
  this.gain.gain.value = this.volume;
  //decay
  this.osc.connect(this.filter); // Connect sound to output
  this.filter.connect(this.gain);
  this.gain.connect(context.destination);
}

Drone.prototype.setPitch = function(p){
  this.osc.frequency.value = p;
}

Drone.prototype.setFilter = function(f){
  this.filter.frequency.value = f;
}

Drone.prototype.setVolume= function(v){
  this.gain.gain.value = v;
}

Drone.prototype.play = function(){
  this.setVolume(this.volume);
  if(!this.played){
    this.osc.start(0); // Play instantly
  }
  this.played = true;
  return false;
}

Drone.prototype.stop = function(){

    this.setVolume(0);
//    this.osc.disconnect();
    return false;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function Pluck(f){
  this.filter;
  this.gain;
  this.osc;
  this.played = false;
  this.volume = map_range(f,100,1500,0.9, 0.4);//based on F range
  this.pitch = f;
  this.buildSynth();
  this.duration = 1;
}

Pluck.prototype.buildSynth = function(){
  this.osc = context.createOscillator(); // Create sound source
  this.osc.type = 3; // Square wave
  this.osc.frequency.value = this.pitch;

  this.filter = context.createBiquadFilter();
  this.filter.type = 0;
  this.filter.frequency.value = 1500;

  this.gain = context.createGain();
  this.gain.gain.value = this.volume;
  //decay
  this.osc.connect(this.filter); // Connect sound to output
  this.filter.connect(this.gain);
  this.gain.connect(context.destination);
}

Pluck.prototype.setPitch = function(p){
  this.osc.frequency.value = p;
}

Pluck.prototype.setFilter = function(f){
  this.filter.frequency.value = f;
}

Pluck.prototype.setVolume= function(v){
  this.gain.gain.value = v;
  this.volume = v;
}

Pluck.prototype.play = function(dur){
  var dur = this.duration || dur;
  this.osc.start(0); // Play instantly
  this.gain.gain.setTargetAtTime(0, 0, 0.2);
  var that = this;
  setTimeout(function(){
  //this looks funny because start and stop don't work on mobile yet
  //and noteOff doesnt allow new notes
    that.setVolume(0);
    that.osc.disconnect();
  },dur*1000);
}

Pluck.prototype.stop = function(){
  return false;
}


