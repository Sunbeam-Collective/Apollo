import { useState, useEffect } from 'react'
import '../App.css'

import useSound from 'use-sound';
import { handleFetch } from '../adapters';
// import testAudio from './assets/summer-storm.mp3'
// import testAudio from './assets/tune-from-diamond.mp3'
// import testAudio from './assets/c.wav'

function SoundTest() {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [timestamp, setTimestamp] = useState();
  const [testAudio, setTestAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const grabAudio = async () => {
      const data = await handleFetch('https://cdnt-preview.dzcdn.net/api/1/1/e/5/c/0/e5c9f000eecf7738ff4e3a4e4e9f42b8.mp3?hdnea=exp=1742952661~acl=/api/1/1/e/5/c/0/e5c9f000eecf7738ff4e3a4e4e9f42b8.mp3*~data=user_id=0,application_id=42~hmac=e86c6b6623b82bf91f02b6b44716be21777cf050e71c63cdb019876e1d654d6c');
      setTestAudio(data);
      setIsLoading(false);
    }
    grabAudio();
  }, []);


  let play;
  let control;
  if (!isLoading) {
    [play, control] = useSound(testAudio, {
      playbackRate,
      volume: 0.5
    });
  }

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
        <button onClick={play}>Play</button>
        <button onClick={speedUp}>Speed Up</button>
        <button onClick={speedDown}>Speed Down</button>
        <button onClick={pause}>Pause</button>
      </div>
    </>
  )
}

export default SoundTest;
