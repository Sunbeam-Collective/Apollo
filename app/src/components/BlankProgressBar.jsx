
function BlankProgressBar() {
  return (
    <input
      type='range'
      min='0'
      max='30'
      style={{'zIndex': '-10', pointerEvents: 'none', cursor: 'none' }}
      className='progress-bar blank'
    />
  )
}

export default BlankProgressBar;
