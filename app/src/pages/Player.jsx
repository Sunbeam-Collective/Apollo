
import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import '../App.css';

import { getDeezerTrack } from "../utils/deezerService";

import {
  TrackDetails,
  MediaControls,
  SecondaryNav,
  Loading,
  QueueCard
} from "../components";

import {
  SongContext
} from '../context'

import {
  edit_icon,
  edit_icon_disabled,
  exit_queue_icon
} from "../assets";

function Player() {
  // fetching states
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // queue stuff
  const [showQueue, setShowQueue] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [queue, setQueue] = useState([]);
  // const queueLoadRef = useRef(false);

  // popout stuff
  const [popoutIsOpen, setPopoutIsOpen] = useState(false);

  // context
  const { track, setTrack, trackRef, songQueue } = useContext(SongContext);

  useEffect(() => {
    // fetching
    const fetchTrack = async () => {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 500));
      let [track, error] = [null, null];
      const loadingTask = async () => {
        try {
          // console.log(id);
          const { data } = await getDeezerTrack(id);
          // console.log(data);
          track = {
            title: data.data.title,
            artist: data.data.artist.name,
            coverSrc: data.data.album.cover_xl,
            previewSrc: data.data.preview,
          };
        } catch (err) {
          error = err;
        }
      };
      await Promise.all([minDelay, loadingTask(id)]);
      if (track !== null) {
        // set audio here as well and handlers for music!!!
        // maybe we can disable the buttons if there's no audio initialized!
        setTrack(track);
        setIsLoading(false);
      }
      else {
        console.error('Error fetching deezer charts:',error);
        setError(error);
      }
    };
    fetchTrack();
    if (songQueue.current !== null) setQueue(listToArr()); // queue updates when song changes while queue modal is open
  }, [id]);

  const handleEdit = async () => {
    await trackRef.current.pause();
    trackRef.current.currentTime = 0;
    navigate(
      `/mixer/${id}`,
      { state: { from: `/player/${id}` } }
    )
  }

  const handleQueueToggle = () => {
    setShowQueue(!showQueue);
    setQueue(listToArr())
  };

  const handleMoveQueue = (e) => {
    e.preventDefault();
    const li = e.target.closest('li');
    // if click on an item or click on the now playing
    if (!li || li.classList.contains('current')) return;
    const songId = parseInt(li.dataset.songid);
    let curr = songQueue.current;
    while (curr.data.id !== songId) {
      curr = curr.next;
    }
    // state updates for rerenders
    const track = {
      title: curr.data.title,
      artist: curr.data.artist.name,
      coverSrc: curr.data.album.cover_xl,
      previewSrc: curr.data.preview,
    }
    setTrack(track);
    // update the queue
    songQueue.current = curr;
    setQueue(listToArr());
  }

  const listToArr = () => {
    if (isRepeating) return [songQueue.current.data];
    // console.log('making queue arr')
    const head = songQueue.current;
    const arr = [head];
    let curr = head.next;
    while (curr !== head) {
      arr.push(curr);
      curr = curr.next;
    }
    const res = arr.map((node) => node.data);
    // console.log('resulting arr: ', res);
    return res;
  }

  if (error !== null) return <h1>{error.message}</h1>;
  if (isLoading) return <Loading />;
  return (
    <>
      {showQueue && (
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
      )}
      <div className='player-container'>
        <SecondaryNav
          props={{
            handleQueueToggle
          }}
        />
        <TrackDetails title={track.title} artist={track.artist} />
        <div className="player-cover">
          <img id="player-cover" src={track.coverSrc} alt={track.title} />
        </div>
        {/* timeline is scrubbable... hopefully */}
        <MediaControls
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
        />
        <div className='player-edit'>
          <button
            className='edit-button'
            onClick={handleEdit}
            >
              <img src={edit_icon} />
            <p id='edit-text'>Edit</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default Player;
