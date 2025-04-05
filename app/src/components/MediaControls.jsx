import {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';

import {
  useNavigate,
  useParams,
  useLocation
} from 'react-router-dom'

import {
  BlankProgressBar
} from '.'

import {
  SongContext
} from '../context'

import {
  DoublyLinkedList
} from '../classes/DoublyLinkedList'

import {
  prev_icon,
  prev_icon_hover,
  prev_icon_click,
  play_icon_round,
  play_icon_hover,
  play_icon_click,
  pause_icon_round,
  pause_icon_hover,
  pause_icon_click,
  next_icon,
  next_icon_hover,
  next_icon_click,
  shuffle_icon,
  shuffle_icon_active,
  shuffle_icon_disabled,
  shuffle_icon_hover,
  shuffle_icon_click,
  repeat_icon,
  repeat_icon_active,
  repeat_icon_hover,
  repeat_icon_click
} from '../assets';

function MediaControls({ isRepeating, setIsRepeating }) {
  // IGNORE STARTS HERE---FEATURES WIP
  // IN PROGRESS: button styling thing
  const shuffleButtonRef = useRef(null);
  const prevButtonRef = useRef(null);
  const playButtonRoundRef = useRef(null);
  const pauseButtonRoundRef = useRef(null);
  const nextButtonRef = useRef(null);
  const repeatButtonRef = useRef(null);

  // IN PROGRESS: button styling thing
  const initializeButtons = () => {
    const initDynamicButton = (buttonRef, normalIcon, hoverIcon, clickIcon) => {
      const button = buttonRef.current
      button.addEventListener('mouseover', () => { button.src = hoverIcon });
      button.addEventListener('mouseout', () => { button.src = normalIcon });
      button.addEventListener('mousedown', () => { button.src = clickIcon });
    }

    initDynamicButton(shuffleButtonRef, './assets/shuffle-icon.svg', './assets/shuffle-icon-hover.svg', './assets/shuffle-icon-click.svg');
    initDynamicButton(prevButtonRef, './assets/prev-icon.svg', './assets/prev-icon-hover.svg', './assets/prev-icon-click.svg');
    initDynamicButton(playButtonRoundRef, './assets/play-icon.svg', './assets/play-icon-hover.svg', './assets/play-icon-click.svg');
    initDynamicButton(pauseButtonRoundRef, './assets/pause-icon.svg', './assets/pause-icon-hover.svg', './assets/pause-icon-click.svg');
    initDynamicButton(nextButtonRef, './assets/next-icon.svg', './assets/next-icon-hover.svg', './assets/next-icon-click.svg');
    initDynamicButton(repeatButtonRef, './assets/repeat-icon.svg', './assets/repeat-icon-hover.svg', './assets/repeat-icon-click.svg');
  }
  // IGNORE ENDS HERE.

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Shared states and setters
  const { trackRef, track, renderedSongs, songQueue } = useContext(SongContext);

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Shuffle and repeat states
  const [isShuffled, setIsShuffled] = useState(false);

  /**
   * Shuffles the renderedSongs array, ensuring the current song is included and no song is repeated.
   *
   * @returns An array containing the shuffled songs, starting from the current song and without duplicates.
   */
  const shuffle = () => {
    const used = new Set();
    const currSongIdx = renderedSongs.findIndex((song) => song.id === +id);
    used.add(currSongIdx);
    while (used.size < renderedSongs.length) {
      const randomIndex = Math.floor(Math.random() * renderedSongs.length);
      used.add(randomIndex);
    }
    return [...used.values()].map((u) => renderedSongs[u]);
  }

  /**
   * Creates a doubly linked list from the rendered songs, starting with the song matching the current ID.
   *
   * @returns A doubly linked list containing the rendered songs, starting with the song with the matching ID.
   */
  const pivotToLinkedList = () => {
    let i = renderedSongs.findIndex((song) => song.id === +id);
    const newLL = new DoublyLinkedList();
    while (newLL.length() < renderedSongs.length) {
      newLL.appendToTail(renderedSongs[i%renderedSongs.length]);
      i++
    }
    return newLL;
  }

  /**
   * Converts an array into a doubly linked list.
   *
   * @param {Array} array The array to convert.
   * @returns {DoublyLinkedList} A new doubly linked list containing the elements of the array.
   */
  const arrayToLinkedList = (array) => {
    const newLL = new DoublyLinkedList();
    for (const a of array) {
      newLL.appendToTail(a);
    }
    newLL.print();
  }

  /**
   * Handles the click event for the "Next" button.
   *
   * If the track is repeating, it restarts the current track. Otherwise, it advances to the next song in the queue.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - If repeating, sets track current time to 0 and updates the current time state.
   *  - If not repeating, updates the song queue, navigates to the next song's Player page, and sets the 'from' state for navigation.
   */
  const handleNextClick = () => {
    if (isRepeating) {
      trackRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    } else {
      const next = songQueue.current.next;
      songQueue.current = next;
      navigate(
        `/player/${next.data.id}`,
        { state: { from: `/player/${id}` } }
      )
    }
  }

  /**
   * Handles the "previous" button click event.  If the current time is greater than 3 seconds, or the track is repeating, rewind to the beginning of the track.  Otherwise, navigate to the previous track in the queue.
   *
   * @param {void}
   * @returns {void}
   * @sideeffects:
   *  - Sets the `currentTime` state to 0 if rewinding or currentTime > 3.
   *  - Updates the `songQueue.current` to the previous song if not rewinding or currentTime > 3.
   *  - Navigates to the previous song's Player page if not rewinding or currentTime > 3.
   */
  const handlePrevClick = () => {
    if (currentTime > 3 || isRepeating) {
      trackRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    } else {
      const prev = songQueue.current.prev;
      songQueue.current = prev;
      navigate(
        `/player/${prev.data.id}`,
        { state: { from: `/player/${id}` } }
      )
    }
  }

  /**
   * Handles the shuffle button click event.  Toggles the shuffle state and updates the song queue.
   *
   * @param {void}
   * @returns {void}
   * @sideeffect/s:
   *  - Updates the `isShuffled` state.
   *  - Modifies the `songQueue.current` linked list based on the shuffle state.
   */
  const handleShuffleClick = () => {
    if (isShuffled) songQueue.current = pivotToLinkedList().head;
    else songQueue.current = arrayToLinkedList(shuffle()).head;
    setIsShuffled(isShuffled => !isShuffled);
  }

  /**
   * Toggles the loop state of the audio track.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Sets the `loop` property of the `trackRef.current` to its inverse.
   *  - Updates the `isRepeating` state to its inverse.
   */
  const handleRepeatClick = () => {
    trackRef.current.loop = !trackRef.current.loop;
    setIsRepeating(isRepeating => !isRepeating);
  }

  /**
   * Updates the current time state with the audio track's current time.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Sets the `currentTime` state to `trackRef.current.currentTime`.
   */
  const handleTimeUpdate = () => {
    setCurrentTime(trackRef.current.currentTime);
  };

  /**
   * Handles the seek operation when the user interacts with the progress bar.
   *
   * @param {Event} e - The change event from the input range slider.
   * @returns {void}
   * @sideEffects:
   *  - Updates the CSS variable `--progress-percent` of the event target to reflect the seek position.
   *  - Sets the CSS variable `--progress-percent` of the progress thumb element to reflect the seek position.
   *  - Sets the `isDragging` state to true.
   *  - Sets the `dragTime` state to the new time value.
   */
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    e.target.style.setProperty('--progress-percent', `${(time / duration) * 100}%`)
    const thumb = document.querySelector('div.progress-thumb');
    thumb.style.setProperty('--progress-percent', `${(time / duration) * 100}%`)
    setIsDragging(true);
    setDragTime(time);
  };

  /**
   * Handles the end of the seek operation, updating the audio track's current time.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Sets the `currentTime` of the `trackRef.current` to the value of `dragTime`.
   *  - Sets the `currentTime` state to the value of `dragTime`.
   *  - Sets the `isDragging` state to false.
   */
  const handleSeekEnd = () => {
    trackRef.current.currentTime = dragTime;
    setCurrentTime(dragTime);
    setIsDragging(false);
  }

  /**
   * Handles the event when the audio track's data has loaded.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Sets the `duration` state to the audio track's duration.
   */
  const handleLoadedData = () => {
    setDuration(trackRef.current.duration);
  }

  /**
   * Handles the event when the audio track has ended.  Plays the next track in the queue or repeats the current track.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - If `isRepeating` is true:
   *    - Sets the `currentTime` state to 0.
   *    - Calls `trackRef.current.play()`.
   *  - If `isRepeating` is false:
   *    - Updates the `songQueue.current` to the next song in the queue.
   *    - Navigates to the Player page for the next song.
   */
  const handleEnded = () => {
    if (isRepeating) {
      setCurrentTime(0);
      trackRef.current.play();
    }
    else {
      const next = songQueue.current.next;
      songQueue.current = next;
      navigate(
        `/player/${next.data.id}`,
        { state: { from: `/player/${id}` } }
      )
    };
  }

  /**
   * Stops the audio playback and resets the current time.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Pauses the `trackRef.current` (audio element).
   *  - Sets `isPlaying` state to false.
   *  - Sets the `currentTime` of `trackRef.current` to 0.
   *  - Sets the `currentTime` state to 0.
   */
  const handleStop = () => {
    trackRef.current.pause();
    setIsPlaying(false);
    trackRef.current.currentTime = 0;
    setCurrentTime(0);
  }

  /**
   * Toggles the playback state of the audio track.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - If `isPlaying` is true:
   *    - Pauses the `trackRef.current` (audio element).
   *  - If `isPlaying` is false:
   *    - Plays the `trackRef.current` (audio element).
   *  - Sets the `isPlaying` state to its inverse.
   */
  const togglePlay = async () => {
    try {
      if (isPlaying) {
        await trackRef.current.pause();
      } else {
        await trackRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  }

  /**
  * This hook handles the initialization of the doubly
  * linked list that is used to represent the songs queue.
  *
  * It runs when the audio source is updated,
  * indicating that the Player has changed to a new song.
  */
  useEffect(() => {
    /**
    * To handle refreshes...
    * TODO: Implement proper state management with tools like
    *  Redux to gracefully handle refreshes on pages/components
    *  that have props/contexts that are depended on parents.
    */
    if (renderedSongs === null) {
      navigate(
        `/home`,
        { state: { from: `/player/${id}` } }
      )
      return;
    }
    /**
    * If coming from the Home page, initialize the doubly linked list object for the queue.
    */
    if (location.state?.from.startsWith('/home')) songQueue.current = pivotToLinkedList(id).head;
    setIsPlaying(true);
    trackRef.current.play();
    trackRef.current.loop = false;
  }, [track.previewSrc]);

  /**
  * This hook handles the dynamic display of the song progress bar.
  *
  * It runs as the current song progresses, or when the
  * song changes (new song loads in) or repeats.
  */
  useEffect(() => {
    // useRef could be used here to grab the element but that would just be clutter. Nothing wrong with simple querySelectors!
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar && !isDragging) {
      progressBar.value = currentTime;
      progressBar.style.setProperty('--progress-percent', `${(currentTime / duration) * 100}%`);
    }
  }, [currentTime, duration])

  /**
  * This hook also handles the dynamic display of the song progress bar
  *
  * It runs as the user drags the thumb element to "seek" through
  * the song.
  */
  useEffect(() => {
    // useRef could be used here to grab the element but that would just be clutter. Nothing wrong with simple querySelectors!
    const thumb = document.querySelector('div.progress-thumb');
    if (isDragging) thumb.style.setProperty('--progress-percent', `${dragTime / duration * 100}%`);
    else thumb.style.setProperty('--progress-percent', `${(currentTime / duration) * 100}%`);
  }, [currentTime, dragTime, duration])

  /**
  * This hook handles some neat keyboard shortcuts
  * for Player controls' ease of access.
  *
  * It runs whenever the playing state changes.
  */
  useEffect(() => {
    const handleKeyPress = async (e) => {
      if (e.repeat) return; // Handles held keypresses!
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          handleStop();
          break;
        default:
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying])

  /**
  * This hook handles the listeners required for audio playback.
  *
  * It runs only on Player mount.
  */
  useEffect(() => {
    // initializeButtons();

    // Initialize thumb offset programmatically.
    const thumb = document.querySelector('div.progress-thumb');
    thumb.style.setProperty('--progress-percent', `${0 / 30 * 100}%`);

    // Grab the audio HTMLelement.
    const audio = trackRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);

      // TODO: this is also part of styling buttons
      // const cleanDynamicButton = (buttonRef, normalIcon, hoverIcon, clickIcon) => {
      //   const button = buttonRef.current;
      //   button.removeEventListener('mouseover', () => { button.src = hoverIcon });
      //   button.removeEventListener('mouseout', () => { button.src = normalIcon });
      //   button.removeEventListener('mousedown', () => { button.src = clickIcon });
      // }
      // cleanDynamicButton(shuffleButtonRef, './assets/shuffle-icon.svg', './assets/shuffle-icon-hover.svg', './assets/shuffle-icon-click.svg');
      // cleanDynamicButton(prevButtonRef, './assets/prev-icon.svg', './assets/prev-icon-hover.svg', './assets/prev-icon-click.svg');
      // cleanDynamicButton(playButtonRoundRef, './assets/play-icon.svg', './assets/play-icon-hover.svg', './assets/play-icon-click.svg');
      // cleanDynamicButton(pauseButtonRoundRef, './assets/pause-icon.svg', './assets/pause-icon-hover.svg', './assets/pause-icon-click.svg');
      // cleanDynamicButton(nextButtonRef, './assets/next-icon.svg', './assets/next-icon-hover.svg', './assets/next-icon-click.svg');
      // cleanDynamicButton(repeatButtonRef, './assets/repeat-icon.svg', './assets/repeat-icon-hover.svg', './assets/repeat-icon-click.svg');
    };
  }, []);

  return (
    <>
      <audio
        ref={trackRef}
        src={track.previewSrc}
        playsInline
      />
      <div className='player-timeline'>
        <BlankProgressBar />
        <input
          type="range"
          min='0'
          max={(duration > 0) ? `${duration}` : '30'}
          step='0.000001'
          value={`${currentTime}` || '0'}
          onChange={handleSeek}
          onMouseUp={handleSeekEnd}
          onTouchEnd={handleSeekEnd}
          className="progress-bar"
        />
        <div
          className='progress-thumb-container'
        >
          <div className='progress-thumb'/>
        </div>
      </div>
      <div className='player-media-controls'>
        {
          isRepeating
          ? <button id='shuffle-button disabled' disabled>
              <img src={shuffle_icon_disabled} ref={shuffleButtonRef} />
            </button>
          : <button id='shuffle-button' onClick={handleShuffleClick}>
              <img src={isShuffled ? shuffle_icon_active : shuffle_icon} ref={shuffleButtonRef} />
            </button>
        }
        <button id='prev-button' onClick={handlePrevClick}>
          <img src={prev_icon} ref={prevButtonRef} />
        </button>
        {
          !isPlaying
          ?
          <button id='play-button-round' onClick={togglePlay}>
              <img src={play_icon_round} ref={playButtonRoundRef} />
          </button>
          :
          <button id='pause-button-round' onClick={togglePlay}>
            <img src={pause_icon_round} ref={pauseButtonRoundRef} />
          </button>
        }
        <button id='next-button' onClick={handleNextClick}>
          <img src={next_icon} ref={nextButtonRef} />
        </button>
        <button id='repeat-button' onClick={handleRepeatClick}>
          <img src={isRepeating ? repeat_icon_active : repeat_icon} ref={repeatButtonRef}  />
        </button>
      </div>
    </>
  )
}


export default MediaControls;
