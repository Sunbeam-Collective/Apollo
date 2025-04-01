import { useState, useRef } from "react";

import { SongContext } from ".";

function SongContextProvider({ children }) {
  const [songData, setSongs] = useState(null);
  const [trendingTabSongs, setTrendingTabSongs] = useState(null);
  const [savedTabSongs, setSavedTabSongs] = useState(null);
  const [track, setTrack] = useState(null);
  const [renderedSongs, setRenderedSongs] = useState(null);
  const [currentTab, setTab] = useState("trending");
  const [trendingSearch, setTrendingSearch] = useState("");
  const [savedSearch, setSavedSearch] = useState("");
  // State to manage whether user is logged in or not
  const [authState, setAuthState] = useState(false);
  const trackRef = useRef(null);
  const waveRef = useRef(null);
  const songQueue = useRef(null);
  const context = {
    waveRef,
    trackRef,
    setSongs,
    songData,
    trendingTabSongs,
    setTrendingTabSongs,
    savedTabSongs,
    setSavedTabSongs,
    songQueue,
    track,
    setTrack,
    renderedSongs,
    setRenderedSongs,
    currentTab,
    setTab,
    trendingSearch,
    setTrendingSearch,
    savedSearch,
    setSavedSearch,
    authState, 
    setAuthState
  };

  return (
    <SongContext.Provider value={context}>{children}</SongContext.Provider>
  );
}

export default SongContextProvider;
