import {
  useState,
  useRef
} from 'react'

function MixerHelp({ handleToggleHelp }) {
  const blockRef = useRef(null);

  const handleExit = (e) => {
    // only handle clicks directly on the outer 'modal'
    if (blockRef.current !== e.target) return;
    handleToggleHelp();
  }

  return (
    <div ref={blockRef} className='mixer-help-block' onClick={handleExit}>
    </div>
  )
}

export default MixerHelp;
