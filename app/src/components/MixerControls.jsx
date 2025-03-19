import {
  stop_icon_rect,
  play_icon_rect,
  pause_icon_rect,
} from '../assets';


function MixerControls({ isPlaying }) {

  return (
    <div className='mixer-controls-container'>
      <button id='stop-button-rect' onClick={() => {}}>
        <img id='stop-button-rect-icon' src={stop_icon_rect} />
      </button>
      {
        isPlaying
        ? <button id='pause-button-rect' onClick={() => {}}>
            <img id='pause-button-rect-icon' src={pause_icon_rect} />
          </button>
        : <button id='play-button-rect' onClick={() => {}}>
            <img id='play-button-rect-icon' src={play_icon_rect} />
          </button>
      }
    </div>
  )
}

export default MixerControls;
