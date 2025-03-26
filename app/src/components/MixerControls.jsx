import {
  stop_icon_rect,
  play_icon_rect,
  pause_icon_rect,
} from '../assets';


function MixerControls({ props }) {
  const {
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    handleStop
  } = props;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='mixer-controls-container'>
      <button id='stop-button-rect' onClick={handleStop}>
        <img id='stop-button-rect-icon' src={stop_icon_rect} />
      </button>
      <span>{formatTime(currentTime)}/{formatTime(duration)}</span>
      {
        isPlaying
        ? <button id='pause-button-rect' onClick={togglePlay}>
            <img id='pause-button-rect-icon' src={pause_icon_rect} />
          </button>
        : <button id='play-button-rect' onClick={togglePlay}>
            <img id='play-button-rect-icon' src={play_icon_rect} />
          </button>
      }
    </div>
  )
}

export default MixerControls;
