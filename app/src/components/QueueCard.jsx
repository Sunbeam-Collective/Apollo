import {
  cover_hover
} from '../assets'

function QueueCard({ song, current }) {
  let listClass;
  if (current) listClass = 'queue-list-item current';
  else listClass = 'queue-list-item'
  return (
    <li
      className='queue-list-item'
      data-songid={song.id}
    >
      <div className='queue-item-hover-container'>
        <img className='cover-hover' src={cover_hover} />
      </div>
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
