async function extractAudioFromVideo(videoFile) {
  // Create a video element and set the source
  const video = document.createElement('video');
  video.src = URL.createObjectURL(videoFile);

  // Create an audio context and source
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  const audioSource = audioContext.createMediaElementSource(video);

  // Connect the source to the destination
  audioSource.connect(destination);

  // Record the audio stream
  const mediaRecorder = new MediaRecorder(destination.stream);
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    // Now you can download or use this audio file
    // e.g., downloadAudio(audioUrl, 'extracted-audio.wav');
  };

  // Start playing and recording
  video.play();
  mediaRecorder.start();

  // Stop after the video duration
  video.onloadedmetadata = () => {
    setTimeout(() => {
      mediaRecorder.stop();
      video.pause();
    }, video.duration * 1000);
  };
}
