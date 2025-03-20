
import {
  prev_icon,
  play_icon_round,
  pause_icon_round,
  next_icon,
  shuffle_icon,
  shuffle_icon_active,
  shuffle_icon_disabled,
  repeat_icon,
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
  const { songData, track } = useContext(SongContext);
  // audio states
  const [isPlaying, setIsPlaying] = useState(false);
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

  const shuffle = (songs) => {
    const used = new Set();
    while (used.size < songs.length) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      used.add(randomIndex);
    }
    return [...used.values()].map((u) => songs[u]);
  }

  const pivotToLinkedList = () => {
    let i = songData.findIndex((song) => song.id === +id);
    const newLL = new DoublyLinkedList();
    while (newLL.length() < songData.length) {
      newLL.appendToTail(songData[i%songData.length]);
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
    // template for like that queue thing
    // console.log(songData);
    if (location.state?.from.startsWith('/home')) songQueue.current = pivotToLinkedList(id).head;
    // songQueue.current.print();
    // if (isShuffled) songQueue.current = shuffle([...songQueue.current]);
    // if (isRepeating) songQueue.current = [track];
    setIsPlaying(true);
    audioRef.current.play();
    audioRef.current.loop = false;
  }, [track.previewSrc]);

  useEffect(() => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.value = currentTime;
      progressBar.style.setProperty('--progress-percent', `${(currentTime / duration) * 100}%`);
    }
  }, [currentTime, duration])

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
        {
          state: {
            from: `/player/${id}`
          }
        }
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
        {
          state: {
            from: `/player/${id}`
          }
        }
      )
    }
  }

  // const handleNextClick = () => {
  //   // const shiftSong = songQueue.current.shift();
  //   // songQueue.current.push(shiftSong);
  //   // console.log(songQueue.current[0].id);
  //   let songId;
  //   if (isShuffled) {
  //     do {
  //       songId = songData[Math.floor(Math.random() * songData.length)].id;
  //     } while (songId === +id);
  //   } else if (isRepeating) {
  //     audioRef.current.currentTime = 0;
  //     setCurrentTime(0);
  //     return;
  //   } else { // no shuffle
  //     // just to account for -1 lol
  //     let position = songData.findIndex((song) => song.id === +id) + 1;
  //     console.log(position);
  //     if (position >= songData.length) position = 0;
  //     songId = songData[position].id;
  //     console.log(songId);
  //   }
  //   navigate(
  //     `/player/${+songId}`,
  //     {
  //       state: {
  //         from: `/player/${id}`
  //       }
  //     }
  //   )
  // }

  // const handlePrevClick = () => {
  //   // const popSong = songQueue.current.pop();
  //   // songQueue.current.unshift(popSong);
  //   // console.log(songQueue.current[0].id);
  //   let songId;
  //   if (isShuffled) {
  //     do {
  //       songId = songData[Math.floor(Math.random() * songData.length)].id;
  //     } while (songId === +id);
  //   } else if (isRepeating) {
  //     songId = 0;
  //     audioRef.current.currentTime = 0;
  //     setCurrentTime(0);
  //     return;
  //   } else { // no shuffle
  //     let position = songData.findIndex((song) => song.id === +id) - 1;
  //     console.log(position);
  //     if (position < 0) position = songData.length-1;
  //     songId = songData[position].id;
  //     console.log(songId);
  //   }
  //   navigate(
  //     `/player/${songId}`,
  //     {
  //       state: {
  //         from: `/player/${id}`
  //       }
  //     }
  //   )
  // }


  const handleShuffleClick = () => {
    if (isShuffled) songQueue.current = pivotToLinkedList().head;
    else songQueue.current = arrayToLinkedList(shuffle(songData)).head;
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
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // const formatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
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
        {
          state: {
            from: `/player/${id}`
          }
        }
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

  useEffect(() => {

    const audio = audioRef.current; // why do i have to do this?
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
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
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />
        {/* Duration */}
        {/* <span>{formatTime(duration)}</span> */}
      </div>
      <div className='player-media-controls'>
        {
          isRepeating
          ? <button id='shuffle-button disabled' disabled>
              <img src={shuffle_icon_disabled} />
            </button>
          : <button id='shuffle-button' onClick={handleShuffleClick}>
              <img src={ isShuffled ? shuffle_icon_active : shuffle_icon } />
            </button>
        }
        <button id='prev-button' onClick={handlePrevClick}>
          <img src={prev_icon} />
        </button>
        {
          !isPlaying
          ?
          <button id='play-button-round' onClick={togglePlay}>
            <img src={play_icon_round} />
          </button>
          :
          <button id='pause-button-round' onClick={togglePlay}>
            <img src={pause_icon_round} />
          </button>
        }
        <button id='next-button' onClick={handleNextClick}>
          <img src={next_icon} />
        </button>
        <button id='repeat-button' onClick={handleRepeatClick}>
          <img src={ isRepeating ? repeat_icon_active : repeat_icon } />
        </button>
      </div>
    </>
  )
}

export default MediaControls;
