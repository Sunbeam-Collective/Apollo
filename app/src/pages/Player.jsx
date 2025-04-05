import {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  TrackDetails,
  MediaControls,
  SecondaryNav,
  Loading,
  QueueModal
} from "../components";

import {
  SongContext
} from '../context'

import {
  getDeezerTrack
} from "../utils/deezerService";

import {
  edit_icon,
  exit_queue_icon
} from "../assets";

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Shared states and setters
  const { track, setTrack, trackRef, songQueue } = useContext(SongContext);

  // Fetching states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Song queue states
  const [showQueue, setShowQueue] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [queue, setQueue] = useState([]);

  // IN PROGRESS: popout stuff
  const [popoutIsOpen, setPopoutIsOpen] = useState(false);

  /**
  * This hook runs when the id location parameter changes,
  * indicating that the current song has changed. It fetches
  * song details necessary for playback from the deezerAPI.
  */
  useEffect(() => {
    const fetchTrack = async () => {
      /**
      * minDelay here is to make sure that the Loading component shows
      * for at least 500 seconds. API calls with getDeezerTrack() is
      * variable, but usually takes very fast (sub 500ms)!
      * This is more of a UX choice so that the transition is
      * smooth and easily interpreted by the user.
      */
      const minDelay = new Promise((resolve) => setTimeout(resolve, 500));
      let [track, error] = [null, null];
      const loadingTask = async () => {
        try {
          const { data } = await getDeezerTrack(id);
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
      /**
      * Promise.all executes the provided async functions concurrently!
      * putting minDelay with loadingTask(id) makes sure that it waits
      * at least 500ms (since that was our minDelay) until it moves
      * onto the next task.
      */
      await Promise.all([minDelay, loadingTask(id)]);
      if (track !== null) {
        setTrack(track);
        setIsLoading(false);
      }
      else {
        console.error('Error fetching deezer charts:',error);
        setError(error);
      }
    };
    fetchTrack();
    // This accounts for when the queue modal is open, and the current song changes
    if (songQueue.current !== null) setQueue(listToArr());
  }, [id]);


  /**
   * Toggles the visibility of the queue and updates the queue state.
   *  When the queue is toggled, the current doubly linked list of songs is converted to an array.
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Sets the `showQueue` state to the opposite of its current value.
   *  - Converts the current doubly linked list of songs to an array.
   *  - Updates the `queue` state with this new array, thereby triggering a re-render of the queue UI.
   */
  const handleQueueToggle = () => {
    setShowQueue(!showQueue);
    setQueue(listToArr())
  };

  /**
   * Handles moving the play queue to a selected song.
   *
   * @param {Event} e - The click event on a QueueCard.
   * @returns {void}
   * @sideEffects
   * - Updates `track` state with selected song info.
   * - Updates `songQueue.current` to point to the selected song.
   * - Updates `queue` state to reflect the new queue order.
   */
  const handleMoveQueue = (e) => {
    e.preventDefault();
    const li = e.target.closest('li');
    // Invalidates clicking on a song that is currently playing
    if (!li || li.classList.contains('current')) return;
    // Traverse to the node of the selected song
    const songId = parseInt(li.dataset.songid);
    let curr = songQueue.current;
    while (curr.data.id !== songId) curr = curr.next;
    // State updates for rerenders
    const track = {
      title: curr.data.title,
      artist: curr.data.artist.name,
      coverSrc: curr.data.album.cover_xl,
      previewSrc: curr.data.preview,
    }
    setTrack(track);
    songQueue.current = curr;
    setQueue(listToArr());
  }

  /**
   * Converts the circular doubly linked list `songQueue` into an array of song data.
   *
   * @param {void}
   * @returns {Array<object>} An array containing the `data` property of each node in the queue.
   * @sideEffects If `isRepeating` is true, returns an array containing only the current song.
   */
  const listToArr = () => {
    if (isRepeating) return [songQueue.current.data];
    /**
    * With the current song as head, build an array
    * while traversing the doubly linked list until
    * it makes a cycle.
    */
    const head = songQueue.current;
    const arr = [head];
    let curr = head.next;
    while (curr !== head) {
      arr.push(curr);
      curr = curr.next;
    }
    const res = arr.map((node) => node.data);
    return res;
  }

  /**
   * Handles the edit button interacton. The track is stopped and
   * the user is taken to the Mixer page, loading the same track.
   *
   * @returns {void}
   * @sideEffects:
   *  - Pauses the audio track using `trackRef.current.pause()`.
   *  - Resets the audio track's current time to 0 using `trackRef.current.currentTime = 0`.
   *  - Navigates to the mixer page with the track's ID and a `from` state using `navigate`.
   */
  const handleEdit = async () => {
    await trackRef.current.pause();
    trackRef.current.currentTime = 0;
    navigate(
      `/mixer/${id}`,
      { state: { from: `/player/${id}` } }
    )
  }

  // Error handling and load rendering
  if (error !== null) return <h1>{error.message}</h1>;
  if (isLoading) return <Loading />;

  return (
    <>
      {showQueue && (
        <QueueModal
          props={{
            handleQueueToggle,
            handleMoveQueue,
            queue
          }}
        />
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
