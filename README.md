# :smile: :angry: :open_mouth: :fearful: :confounded: :neutral_face: :notes:
# S0und_F4c3

*This is an interactive computer vision system developed with **p5.js**, **ml5.js**, and the **p5.sound** library. Its central concept is to translate human facial gestures into a sonic instrument. Leveraging the ml5.js API, the system detects faces through the webcam and captures the coordinates and distances of each facial landmark. These numerical measurements are then mapped into sound using the p5.sound library.*

*While the project remains a prototype with limited functionality and interactivity, and its sound generation is still somewhat rudimentary, it establishes a promising framework. Future explorations could expand the sonic range, enable simultaneous responses to multiple faces, or extend the system to process video input.*


### Arquitecture logic

*The architecture is designed around a **real-time feedback loop**: the webcam captures the user’s face, face landmarks are extracted and processed, and a small buffer of recent emotion detections is used to determine the dominant emotional state. Each emotion corresponds to a distinct musical scale, giving the system a semantic mapping between affective state and tonal palette.*

*Gesture mapping is intentionally minimal yet expressive:*
- **Mouth openness** triggers notes, acting as the primary sound activation.
- **Eyebrow height** controls pitch selection within the current scale.
- **Smile width** modulates timbre via filter cutoff.
- **Head tilt** adjusts stereo panning, embedding spatiality in the sonic output.


### Sketches

*Some doodles and sketches about my thinking process for the project, how it would look and its interface:*



### Demo



### Requirements
- Web browser.
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

*Hosted in Render: https://workshop3-bookmarks-atlas.onrender.com*