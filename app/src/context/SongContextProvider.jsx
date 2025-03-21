import {
  useState,
  useRef
} from 'react'

import {
  SongContext
} from '.';


function SongContextProvider({ children }) {
  const [songData, setSongs] = useState(null);
  const [track, setTrack] = useState(null);
  const [renderedSongs, setRenderedSongs] = useState(null);
  const songQueue = useRef([]);
  const context = { songData, setSongs, songQueue, track, setTrack, renderedSongs, setRenderedSongs };

  return (
    <SongContext.Provider value={context}>
      {children}
    </SongContext.Provider>
  );
}

export default SongContextProvider;
