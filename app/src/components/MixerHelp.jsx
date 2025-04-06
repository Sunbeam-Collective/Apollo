import {
  useState,
  useRef
} from 'react'

import {
  exit_queue_icon,
  rate_drag,
  rate_scroll,
  rate_type,
  time_hori_scroll,
  time_scrub,
  time_vert_scroll
} from '../assets'

function MixerHelp({ handleToggleHelp }) {
  const blockRef = useRef(null);

  const handleExit = (e) => {
    // only handle clicks directly on the outer 'modal'
    handleToggleHelp();
  }

  return (
    <>
      <div ref={blockRef} className='mixer-help-block' onClick={handleExit}>
        <div className='help-header'>
          <div className='help-header-left-padding'>
            {/* nothing */}
          </div>
          <div className='help-header-title'>
            {/* queue */}
          </div>
          <div className='help-header-exit-container'>
            <button id='help-exit' onClick={handleExit}>
              <img src={exit_queue_icon} />
            </button>
          </div>
        </div>
        <div className='help-body'>
          <div className='timeline-controls-container'>
            <h2 className='mixer-label'>Timeline Controls</h2>
            <p>Drag and click to scrub the track.</p>
            <video src={time_scrub} autoPlay loop='true' />
            <p>Zoom in/out with vertical scrolls.</p>
            <video src={time_vert_scroll} autoPlay loop='true' />
            <p>Seek the timeline with horizontal scrolls.</p>
            <video src={time_hori_scroll} autoPlay loop='true' />
          </div>
          <div className='rate-controls-container'>
            <h2 className='mixer-label'>Playback Rate Knob</h2>
            <p>Drag the knobs to adjust to rate.</p>
            <video src={rate_drag} autoPlay loop='true' />
            <p>or scroll horizontally...</p>
            <video src={rate_scroll} autoPlay loop='true' />
            <p>You can also manually input the value.</p>
            <video src={rate_type} autoPlay loop='true' />
          </div>
        </div>
      </div>
    </>
  )
}

export default MixerHelp;
