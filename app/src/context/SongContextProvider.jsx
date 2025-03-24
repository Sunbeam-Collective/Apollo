import { useState, useRef } from "react";

import { SongContext } from ".";

function SongContextProvider({ children }) {
  const [trendingTabSongs, setTrendingTabSongs] = useState(null);
  const [savedTabSongs, setSavedTabSongs] = useState(null);
  const [track, setTrack] = useState(null);
  const [renderedSongs, setRenderedSongs] = useState(null);
  const [currentTab, setTab] = useState("trending");
  const [trendingSearch, setTrendingSearch] = useState("");
  const [savedSearch, setSavedSearch] = useState("");
  const songQueue = useRef([]);
  const context = {
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
  };

  return (
    <SongContext.Provider value={context}>{children}</SongContext.Provider>
  );
}

export default SongContextProvider;
