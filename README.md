# :smile: :angry: :open_mouth: :fearful: :confounded: :neutral_face: :notes:
# S0und_F4c3

*This is an interactive computer vision system developed with **p5.js**, **ml5.js**, and the **p5.sound** library. Its core concept is to translate human facial gestures into a sonic instrument. Leveraging the ml5.js API, the system detects faces through the webcam and captures the coordinates and distances of each facial landmark. These numerical measurements are then mapped into sound using the p5.sound library.*

*While the project remains a prototype with limited functionality and interactivity, and its sound generation is still somewhat rudimentary, it establishes a promising framework. Future explorations could expand the sonic range, enable simultaneous responses to multiple faces, or extend the system to process video input.*

### Tech Stack
- p5.js
- ml5.js
- p5.sound
- Node.js

### Arquitecture logic

*The architecture is designed around a **real-time feedback loop**: the webcam captures the user’s face, face landmarks are extracted and processed, and a small buffer of recent emotion detections is used to determine the dominant emotional state. Each emotion corresponds to a distinct musical scale, giving the system a semantic mapping between affective state and tonal palette.*

*Gesture mapping is intentionally minimal yet expressive:*
- **Mouth openness** triggers notes, acting as the primary sound activation.
- **Eyebrow height** controls pitch selection within the current scale.
- **Smile width** modulates timbre via filter cutoff.
- **Head tilt** adjusts stereo panning, embedding spatiality in the sonic output.


```
/////// Face metrics:

function extractFaceMetrics(face) {
  let p = face.landmarks.positions;

  mouthOpen = dist(p[62]._x, p[62]._y, p[66]._x, p[66]._y); // vertical mouth
  smileWidth = dist(p[48]._x, p[48]._y, p[54]._x, p[54]._y); // horizontal smile
  browHeight = dist(p[19]._x, p[19]._y, p[37]._x, p[37]._y); // eyebrow to eye
  headTilt = atan2(p[45]._y - p[36]._y, p[45]._x - p[36]._x); // tilt angle
}
```


```
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
```

```
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
```


### Demo video

*https://youtu.be/8UZCHtpR-_Y*


### Requirements

- Web browser. **Please use Chrome or any other browser that is not Safari**.
- WebCam permission.
- Microphone input permission.


### How to Run

*You can also download the repo and run it in your machine localy.*

- Give the corresponding permissions to the browser about Webcam and Micro input.
- Make sure you are in a space with good lighting.
- Click screen to start/stop the sound.
- Smile or open your mouth surprisingly to trigger a sound. Play with your gestures!


### Links

*GitHub Repo: https://github.com/A-serna0415/workshop_4_Sound_Face.git*

*Hosted in Render: https://sound-face.onrender.com*
