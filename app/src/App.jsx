import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import useSound from 'use-sound';
// import testAudio from './assets/summer-storm.mp3'
// import testAudio from './assets/tune-from-diamond.mp3'
import testAudio from './assets/c.wav'

function App() {
  const [playbackRate, setPlaybackRate] = useState(1);
  // const [timestamp, setTimestamp] = useState();

  const [play, control] = useSound(testAudio, {
    playbackRate,
    volume: 0.5
  });

  const pause = () => {
    control.pause();
  }


  const speedUp = () => {
    setPlaybackRate(() => playbackRate + 0.1);
  }

  const speedDown = () => {
    setPlaybackRate(() => playbackRate - 0.1);
  }

  return (
    <>
      <div>
        <h1>{control.duration}</h1>
        <button onClick={play}>Play</button>
        <button onClick={speedUp}>Speed Up</button>
        <button onClick={speedDown}>Speed Down</button>
        <button onClick={pause}>Pause</button>
      </div>
    </>
  )
}

export default App
