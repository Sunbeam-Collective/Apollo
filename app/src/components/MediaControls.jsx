
import {
  prev_icon,
  play_icon,
  pause_icon,
  next_icon,
  shuffle_icon,
  repeat_icon
} from '../assets';

import {
  useState
} from 'react';

function MediaControls({}) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className='player-media-controls'>
      <button id='shuffle-button' onClick={() => {}}>
        <img src={shuffle_icon} />
      </button>
      <button id='prev-button' onClick={() => {}}>
        <img src={prev_icon} />
      </button>
      {
        isPlaying
        ?
        <button id='play-button' onClick={() => {}}>
          <img src={play_icon} />
        </button>
        :
        <button id='pause-button' onClick={() => {}}>
          <img src={pause_icon} />
        </button>
      }
      <button id='next-button' onClick={() => {}}>
        <img src={next_icon} />
      </button>
      <button id='repeat-button' onClick={() => {}}>
        <img src={repeat_icon} />
      </button>
    </div>
  )
}

export default MediaControls;
