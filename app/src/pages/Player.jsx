
import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import '../App.css';

import { getDeezerTrack } from "../services/deezerService";

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

import { useScrollLock } from "../adapters";

function Player() {
  // no scrolling while on player!
  useScrollLock();

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

  const listToArr = () => {
    if (isRepeating) return [];
    // console.log('making queue arr')
    const head = songQueue.current;
    const arr = [];
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
              queue
            </div>
            <div className='queue-header-exit-container'>
              <button id='queue-exit' onClick={handleQueueToggle}>
                <img src={exit_queue_icon} />
              </button>
            </div>
          </div>
          <div className='queue-body'>
            <ul className='queue-list'>
              {queue.length > 0 ? (
                queue.map((song) => {
                  return (
                    <QueueCard key={crypto.randomUUID()} song={song} />
                  )
                })
              ) : (
                <p>u r repeating one song 🤦</p>
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
