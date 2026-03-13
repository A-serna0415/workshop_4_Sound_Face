/*

Workshop 4: S0und_F4c3
By Andrés Serna
Last update: 13 March 2026

Blurp: The core concept for this workshop is to turn the face into a sound instrument.
Using ml5.js to detect face landmarks and expressions, we translate facial gestures
into sound with p5.sound library.

Main Tech stack:
- p5.js
- p5.sound
- ml5.js

*/


////// Global Variables:

let faceapi;          // ml5 face API object
let detections = [];  // stores the results of face detection for each frame

let video;            // webcam capture object

// video detection resolution
let detectW = 640;
let detectH = 480;

// video placement on canvas
let videoX = 0;
let videoY = 0;
let videoW = 0;
let videoH = 0;


/////// Sound Variables:
let osc;              // main oscillator
let filter;           // low-pass filter for tone control
let env;              // envelope to shape amplitude over time
let reverb;           // reverb effect for a more spacious sound
let audioActive = false; // whether sound is active

/////// Face:
let mouthOpen = 0;      // vertical distance of mouth opening
let smileWidth = 0;     // horizontal distance of smile
let browHeight = 0;     // distance between brow and eye
let headTilt = 0;       // face tilt angle in radians

let prevMouth = 0;      // previous mouthOpen value, for detecting mouth trigger to sound
let mouthThreshold = 15; // threshold to trigger a note

/////// Emotions detect:
let currentEmotion = "neutral"; // tracked emotion of the face
let emotionBuffer = [];         // buffer to smooth emotions over frames so browser doesn't colapse
let bufferSize = 10;            // how many frames to consider for smoothing


/////// Musical scales:

// Relative offsets to baseNote
let scales = {
  happy: [0, 2, 4, 7, 9, 12],      // major pentatonic
  sad: [0, 2, 3, 5, 7, 8, 10, 12], // natural minor
  angry: [0, 1, 2, 3, 4, 5, 6, 7], // chromatic cluster
  surprised: [0, 2, 4, 6, 8, 10, 12], // whole tone
  disgusted: [0, 3, 6, 9, 12],     // diminished
  neutral: [0, 2, 4, 5, 7, 9, 11, 12] // major scale
};

let baseNote = 60; // MIDI note for C4 (middle C)

/////// Particles feedback
let particles = []; // array to hold visual particle objects for feedback


function setup() {

  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO); // start webcam capture
  video.size(detectW, detectH); 
  video.hide();                 

  calculateVideoPlacement();    // calculate where to draw video on canvas

  // face detection options
  const options = {
    withLandmarks: true,       // detect facial landmarks
    withExpressions: true,     // detect facial expressions
    withDescriptors: false,    // we don’t need face recognition
    minConfidence: 0.5         // minimum confidence for detection
  };

  faceapi = ml5.faceApi(video, options, modelReady); // initialize face API
}

////// Responsive canvas:

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateVideoPlacement();              // recalc video placement on resize so it doesn't go ot screen
}


////// Video placement:

function calculateVideoPlacement() {
  // maintain aspect ratio while scaling
  let aspect = detectW / detectH;

  videoW = width * 0.7; // scale to 70% of canvas width
  videoH = videoW / aspect;

  // limit video height to 80% of canvas height
  if (videoH > height * 0.8) {
    videoH = height * 0.8;
    videoW = videoH * aspect;
  }

  // center video on canvas
  videoX = width / 2 - videoW / 2;
  videoY = height / 2 - videoH / 2;
}


///// ml5.js model ready:

function modelReady() {
  faceapi.detect(gotFaces); // start face detection loop
}


////// Face detection loop:

function gotFaces(err, result) {

  if (err) {
    console.log(err); // to debug
    return;
  }

  detections = result; // save detection results

  if (detections.length > 0) {
    let face = detections[0];

    extractFaceMetrics(face); // compute metrics (mouth, smile, brow, tilt)
    updateEmotion(face);      // update currentEmotion using smoothed buffer
  }

  faceapi.detect(gotFaces); // recursive call to continue detection loop
}


function draw() {
  background(15);     // dark background

  drawVideo();        // draw webcam feed
  drawLandmarks();    // overlay facial landmarks
  updateParticles();  // update and draw particles
  drawUI();           // draw UI panel

  if (audioActive) {
    updateSound();    // update sound parameters based on gestures
  }
}

////// Particles:

function spawnParticles() {
  let col = emotionColor(); // color based on emotion

  for (let i = 0; i < 20; i++) {
    let px = videoX + videoW / 2; // spawn at center of video
    let py = videoY + videoH / 2;

    particles.push(new Particle(px, py, col)); // add particle to array
  }
}

function updateParticles() {
  // iterate backwards to safely remove dead particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();   // update position and alpha
    p.draw();     // render particle

    if (p.isDead()) {
      particles.splice(i, 1); // remove dead particle
    }
  }
}


////// Color for emotions detected:

function emotionColor() {
  // returns color corresponding to current emotion
  if (currentEmotion === "happy") return color(255, 210, 0);
  if (currentEmotion === "sad") return color(80, 150, 255);
  if (currentEmotion === "angry") return color(255, 60, 60);
  if (currentEmotion === "surprised") return color(200, 80, 255);
  if (currentEmotion === "disgusted") return color(120, 200, 120);
  return color(200); // in case the system doesn't recognise any
}


/////// Video draw:

function drawVideo() {
  image(video, videoX, videoY, videoW, videoH); // draw webcam feed manually
}


/////// Landmarks draw:

function drawLandmarks() {
  if (detections.length === 0) return;

  let points = detections[0].landmarks.positions;

  stroke(0, 255, 200); // bright cyan for visibility
  strokeWeight(3);

  // map detection coordinates to canvas space
  for (let p of points) {
    let x = map(p._x, 0, detectW, videoX, videoX + videoW);
    let y = map(p._y, 0, detectH, videoY, videoY + videoH);
    point(x, y); // draw landmark
  }
}


/////// UI Panel:

function drawUI() {
  fill(0, 180); // semi-transparent background
  noStroke();
  rect(20, 20, 260, 180, 12); // rounded rectangle for panel

  fill(255);
  textSize(16);
  text("Sound_Face by Andrés Serna", 40, 50);

  textSize(14);
  text("Emotion: " + currentEmotion, 40, 75);

  if (!audioActive)
    text("Click to start sound", 40, 100);
  else
    text("Click to stop sound", 40, 100);

  drawGestureHelper(); // call gestures UI panel
}

function drawGestureHelper() {
  fill(200);       
  textSize(12);
  let startY = 130;

  text("open/close mouth  → note", 40, startY);
  text("rise eyebrows     → pitch", 40, startY + 18);
  text("smile             → tone", 40, startY + 36);
  text("tilt face         → stereo", 40, startY + 54);
}

/////// User sound activation:

function mousePressed() {
  if (!audioActive) {
    userStartAudio(); // p5.sound requires user gesture to start
    startSound();     // initialize sound engine
    audioActive = true;
  } else {
    stopSound();      // stop sound
    audioActive = false;
  }
}

/////// Sound Engine:

function startSound() {
  osc = new p5.Oscillator('sine'); // basic sine wave
  osc.start();

  filter = new p5.LowPass();       // low-pass filter

  osc.disconnect(); // disconnect oscillator from master
  osc.connect(filter); // connect to filter

  reverb = new p5.Reverb();        // add spatial reverb
  reverb.process(filter, 3, 2);   // reverb decay = 3s, room size = 2

  env = new p5.Envelope();         // envelope for note amplitude
  env.setADSR(0.01, 0.2, 0.3, 0.5); // attack, decay, sustain, release
  env.setRange(0.7, 0);            // peak amplitude, min amplitude
}

/////// Stop sound:

function stopSound() {
  osc.stop();
}


/////// Sound control base in gestures:

function updateSound() {
  // select scale by emotion
  let scale = scales[currentEmotion] || scales["neutral"];

  // map eyebrow height to note index
  let noteIndex = floor(map(browHeight, 5, 30, 0, scale.length, true));

  let midiNote = baseNote + scale[noteIndex]; // calculate MIDI note
  let freq = midiToFreq(midiNote);            // convert to frequency
  osc.freq(freq);

  // filter cutoff depends on smile width
  let cutoff = map(smileWidth, 20, 120, 300, 4000, true);
  filter.freq(cutoff);

  // pan stereo from head tilt
  let pan = map(headTilt, -0.5, 0.5, -1, 1, true);
  osc.pan(pan);

  // trigger envelope when mouth opens
  if (mouthOpen > mouthThreshold && prevMouth <= mouthThreshold) {
    env.play(osc);
    spawnParticles(); // add visual particles feedback
  }

  prevMouth = mouthOpen;
}


/////// Face metrics:

function extractFaceMetrics(face) {
  let p = face.landmarks.positions;

  mouthOpen = dist(p[62]._x, p[62]._y, p[66]._x, p[66]._y); // vertical mouth
  smileWidth = dist(p[48]._x, p[48]._y, p[54]._x, p[54]._y); // horizontal smile
  browHeight = dist(p[19]._x, p[19]._y, p[37]._x, p[37]._y); // eyebrow to eye
  headTilt = atan2(p[45]._y - p[36]._y, p[45]._x - p[36]._x); // tilt angle
}


////// Emotion detect:

function updateEmotion(face) {
  let exp = face.expressions;

  let best = "neutral";
  let maxVal = 0;

  for (let e in exp) {
    if (exp[e] > maxVal) {
      maxVal = exp[e];
      best = e; // pick the dominant emotion
    }
  }

  emotionBuffer.push(best);
  if (emotionBuffer.length > bufferSize) emotionBuffer.shift(); // maintain buffer size

  currentEmotion = mode(emotionBuffer); // smooth emotion over frames
}


////// Mode function: to determine which emotion is the dominant one in the interaction base on the buffer function.

function mode(arr) {
  let count = {}; // stores the emotions detected
  let max = 0; // highes count of emotion
  let result = arr[0]; // stores the "mode", the most frequent emotion in 10 frames (buffer)

  for (let val of arr) {
    count[val] = (count[val] || 0) + 1; // tally counts
    if (count[val] > max) {
      max = count[val];
      result = val; // most frequent value
    }
  }

  return result;
}