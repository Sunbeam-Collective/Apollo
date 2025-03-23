
import {
  prev_icon,
  prev_icon_hover,
  play_icon_round,
  pause_icon_round,
  next_icon,
  next_icon_hover,
  shuffle_icon,
  shuffle_icon_hover,
  shuffle_icon_active,
  shuffle_icon_disabled,
  repeat_icon,
  repeat_icon_hover,
  repeat_icon_active
} from '../assets';

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
  SongContext
} from '../context'

import {
  DoublyLinkedList
} from '../classes/DoublyLinkedList'

function MediaControls() {
  const { track, renderedSongs } = useContext(SongContext);
  // audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // const [volume, setVolume] = useState(1);
  // const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // shuffle and repeat toggles
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  let songQueue = useRef(new DoublyLinkedList());
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // button
  const shuffleButtonRef = useRef(null);
  const prevButtonRef = useRef(null);
  const playButtonRoundRef = useRef(null);
  const pauseButtonRoundRef = useRef(null);
  const nextButtonRef = useRef(null);
  const repeatButtonRef = useRef(null);

  const shuffle = (songs) => {
    const used = new Set();
    while (used.size < songs.length) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      used.add(randomIndex);
    }
    return [...used.values()].map((u) => songs[u]);
  }

  const pivotToLinkedList = () => {
    let i = renderedSongs.findIndex((song) => song.id === +id);
    const newLL = new DoublyLinkedList();
    while (newLL.length() < renderedSongs.length) {
      newLL.appendToTail(renderedSongs[i%renderedSongs.length]);
      i++
    }
    newLL.print();
    return newLL;
  }

  const arrayToLinkedList = (array) => {
    const newLL = new DoublyLinkedList();
    console.log(newLL.head);
    for (const a of array) {
      newLL.appendToTail(a);
      console.log(newLL.tail);
    }
    newLL.print();
    return newLL;
  }

  useEffect(() => {
    if (location.state?.from.startsWith('/home')) songQueue.current = pivotToLinkedList(id).head;
    setIsPlaying(true);
    audioRef.current.play();
    audioRef.current.loop = false;
  }, [track.previewSrc]);

  useEffect(() => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar && !isDragging) {
      progressBar.value = currentTime;
      progressBar.style.setProperty('--progress-percent', `${(currentTime / duration) * 100}%`);
    }
  }, [currentTime, duration])

  useEffect(() => {
    const thumb = document.querySelector('div.progress-thumb');
    if (isDragging) thumb.style.setProperty('--progress-percent', `${dragTime / duration * 100}%`);
    else thumb.style.setProperty('--progress-percent', `${(currentTime / duration) * 100}%`);
  }, [currentTime, dragTime, duration])

  const handleNextClick = () => {
    if (isRepeating) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    } else { // no shuffle
      const next = songQueue.current.next;
      songQueue.current = next;
      navigate(
        `/player/${next.data.id}`,
        { state: { from: `/player/${id}` } }
      )
    }
  }

  const handlePrevClick = () => {
    if (currentTime > 3 || isRepeating) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    } else { // no shuffle
      const prev = songQueue.current.prev;
      songQueue.current = prev;
      navigate(
        `/player/${prev.data.id}`,
        { state: { from: `/player/${id}` } }
      )
    }
  }

  const handleShuffleClick = () => {
    if (isShuffled) songQueue.current = pivotToLinkedList().head;
    else songQueue.current = arrayToLinkedList(shuffle(renderedSongs)).head;
    setIsShuffled(isShuffled => !isShuffled);
  }

  const handleRepeatClick = () => {
    audioRef.current.loop = !audioRef.current.loop;
    setIsRepeating(isRepeating => !isRepeating);
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    e.target.style.setProperty('--progress-percent', `${(time / duration) * 100}%`)
    // move the thumb as well
    const thumb = document.querySelector('div.progress-thumb');
    thumb.style.setProperty('--progress-percent', `${(time / duration) * 100}%`)
    setIsDragging(true);
    setDragTime(time);
  };

  const handleSeekEnd = () => {
    audioRef.current.currentTime = dragTime;
    setCurrentTime(dragTime);
    setIsDragging(false);
  }

  // const formatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
    console.log('Audio duration: ', audioRef.current.duration);
  }

  const handleEnded = () => {
    if (isRepeating) {
      setCurrentTime(0);
      audioRef.current.play();
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

  async function togglePlay() {
    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  }

  // const handleVolume = (e) => {
  //   const newVolume = parseFloat(e.target.value);
  //   audioRef.current.volume = newVolume;
  //   setVolume(newVolume);
  //   if (newVolume === 0) {
  //     setIsMuted(true);
  //   } else {
  //     setIsMuted(false);
  //   }
  // }

  // const toggleMute = () => {
  //   if (isMuted) {
  //     audioRef.current.volume = volume;
  //     setIsMuted(false);
  //   } else {
  //     audioRef.current.volume = 0;
  //     setIsMuted(true);
  //   }
  // }

  function initializeButtons() {
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

  useEffect(() => {
    initializeButtons();

    const audio = audioRef.current; // why do i have to do this?
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);

      const cleanDynamicButton = (buttonRef, normalIcon, hoverIcon, clickIcon) => {
        const button = buttonRef.current;
        button.removeEventListener('mouseover', () => { button.src = hoverIcon });
        button.removeEventListener('mouseout', () => { button.src = normalIcon });
        button.removeEventListener('mousedown', () => { button.src = clickIcon });
      }
      cleanDynamicButton(shuffleButtonRef, './assets/shuffle-icon.svg', './assets/shuffle-icon-hover.svg', './assets/shuffle-icon-click.svg');
      cleanDynamicButton(prevButtonRef, './assets/prev-icon.svg', './assets/prev-icon-hover.svg', './assets/prev-icon-click.svg');
      cleanDynamicButton(playButtonRoundRef, './assets/play-icon.svg', './assets/play-icon-hover.svg', './assets/play-icon-click.svg');
      cleanDynamicButton(pauseButtonRoundRef, './assets/pause-icon.svg', './assets/pause-icon-hover.svg', './assets/pause-icon-click.svg');
      cleanDynamicButton(nextButtonRef, './assets/next-icon.svg', './assets/next-icon-hover.svg', './assets/next-icon-click.svg');
      cleanDynamicButton(repeatButtonRef, './assets/repeat-icon.svg', './assets/repeat-icon-hover.svg', './assets/repeat-icon-click.svg');
    };
  }, []);


  return (
    <>
      <audio
        ref={audioRef}
        src={track.previewSrc}
        playsInline
      />
      <div className='player-timeline'>
        {/* Current Time */}
        {/* <span>{formatTime(currentTime)}</span> */}
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          step='0.000001'
          value={currentTime}
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
        {/* Duration */}
        {/* <span>{formatTime(duration)}</span> */}
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
