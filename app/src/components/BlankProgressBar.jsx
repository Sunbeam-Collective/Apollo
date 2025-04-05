
function BlankProgressBar() {
  return (
    <input
      type='range'
      min='0'
      max='30'
      style={{ position: 'absolute', 'zIndex': '-10' }}
      className='progress-bar'
    />
  )
}

export default BlankProgressBar;
