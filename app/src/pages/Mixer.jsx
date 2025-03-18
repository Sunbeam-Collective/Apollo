import {
  MediaControls,
  TrackDetails,
  MixerTimeline,
  ControlKnobs,
} from '../components'

import {
  useScrollLock
} from '../adapters'

function Mixer() {
  useScrollLock();

  const [title, artist] = ['placeholder', 'placeholder']
  return (
    <>
      <div className='mixer-container'>
        <TrackDetails
          title={title}
          artist={artist}
        />
        <MixerTimeline />
        <MediaControls />
        <ControlKnobs />
      </div>
    </>
  )
}

export default Mixer;
