
function TrendingItem({ position, id, title, artist, coverSrc }) {
  return (
    <li data-id={id}>
      <div className='trending-container'>
        <div className='position'>
          {position}
        </div>
        <div className='trending-album-cover'>
          <img src={coverSrc} alt={title} />
        </div>
        <div className='trending-song-details'>
          <p>{title}</p>
          <p>{artist}</p>
        </div>
      </div>
    </li>
  )
}

export default TrendingItem;
