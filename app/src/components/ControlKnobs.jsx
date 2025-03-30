import {
  SongContext
} from '../context';

function ControlKnobs({ props }) {
  const {
    playbackRate,
    handleSpeed
  } = props;
  return (
    <>
      <div className='control-knobs-container'>
        <input
          type='range'
          step='0.001'
          value={playbackRate}
          min='0.5'
          max='2'
          onChange={handleSpeed}
          className="playback-rate-slider"
        />
      </div>
    </>
  )
}

export default ControlKnobs;
