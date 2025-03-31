
function QueueCard({ song }) {
  return (
    <li
      className='queue-list-item'
    >
      <div className='queue-item-cover'>
        <img src={song.album.cover_xl} />
      </div>
      <div className='queue-item-details'>
        <div className='queue-item-title'>
          {song.title}
        </div>
        <div className='queue-item-artist'>
          {song.artist.name}
        </div>
      </div>
    </li>
  )
}

export default QueueCard;
