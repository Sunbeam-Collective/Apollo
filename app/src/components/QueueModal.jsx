import {
  QueueCard
} from '.'

import {
  exit_queue_icon
} from '../assets'

function QueueModal({ props }) {
  const {
    handleQueueToggle,
    handleMoveQueue,
    queue
  } = props;

  return (
    <div
      className='queue-modal'
    >
      <div className='queue-header'>
        <div className='queue-header-left-padding'>
          {/* nothing */}
        </div>
        <div className='queue-header-title'>
          {/* queue */}
        </div>
        <div className='queue-header-exit-container'>
          <button id='queue-exit' onClick={handleQueueToggle}>
            <img src={exit_queue_icon} />
          </button>
        </div>
      </div>
      <div className='queue-body'>
        <ul className='queue-list' onClick={handleMoveQueue}>
          {queue.length > 1 ? (
            <>
              <h2 className='queue-label'>Now playing</h2>
              <QueueCard key={crypto.randomUUID()} song={queue[0]} current={true} />
              <h2 className='queue-label'>Up next</h2>
              {queue.slice(1).map((song) => {
                return (
                  <QueueCard key={crypto.randomUUID()} song={song} current={false} />
                )
              })}
            </>
          ) : (
            <>
              <h2 className='queue-label'>On repeat</h2>
              <QueueCard key={crypto.randomUUID()} song={queue[0]} current={true} />
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default QueueModal;
