import {
  MediaControls,
  TrackDetails,
  MixerTimeline,
  ControlKnobs,
  SecondaryNav
} from '../components'

import {
  useScrollLock
} from '../adapters'

function Mixer() {
  useScrollLock();

  return (
    <>
      <SecondaryNav />
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
