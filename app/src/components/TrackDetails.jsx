
function TrackDetails({ title, artist }) {
  return (
    <div className='player-details'>
      <p className='track-title'>{title}</p>
      <p className='track-artist'>{artist}</p>
    </div>
  )
}

export default TrackDetails;
