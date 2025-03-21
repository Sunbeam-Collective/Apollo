import {
  useEffect,
  useState,
  useContext,
  useRef
} from "react";

import HomepageHeader from "../components/HomepageHeader";
import HomepageFooter from "../components/HomepageFooter";
import SongList from "../components/SongList";
import { getDeezerChart } from "../services/deezerService";
import SearchBar from "../components/SearchBar";
import {
  initLocalStorage,
  getLocalStorageData,
} from "../utils/localStorageHelpers";

import {
  SongContext
} from '../context'

function Home() {
  // State to manage array of songs to be rendered (Trending View)
  const { songData, setSongs } = useContext(SongContext);
  // State to manage what gets rendered
  const { renderedSongs, setRenderedSongs } = useContext(SongContext);
  // State to manage trending and saved tabs
  const [currentTab, setTab] = useState("trending");
  // State to manage state of search bar
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const searchRef = useRef({ trending: "", saved: "" });

  // This useEffect loads chart songs on-mount and initializes localstorage
  useEffect(() => {
    const doFetch = async () => {
      // Deconstruct chart data from Deezer.
      const { data, status } = await getDeezerChart();
      if (data) {
        setRenderedSongs(data.data);
        setSongs(data.data);
      }
      if (status !== 200) setError(true);
    };
    // Initialize local storage
    const localStorageData = getLocalStorageData();
    if (!localStorageData) initLocalStorage();
    doFetch();
  }, []);

  // This useEffect handles what to render depending on the current tab
  useEffect(() => {
    if (currentTab === "trending" && songData) {
      searchRef.current.trending = searchTerm;
      setSearchTerm(searchRef.current.saved);
      setRenderedSongs(songData);
    } else if (currentTab === "saved") {
      searchRef.current.saved = searchTerm;
      const data = getLocalStorageData();
      setSearchTerm(searchRef.current.trending);
      setRenderedSongs(data);
    }
  }, [currentTab]);

  // Render if error is true
  if (error) return <>An Error Has Occurred While Loading the Page</>;

  return (
    <>
      <div id="homepage-container">
        <HomepageHeader />
        <SearchBar
          prop={{
            currentTab,
            songData,
            setRenderedSongs,
            setSongs,
            searchTerm,
            setSearchTerm,
          }}
        />
        <SongList
          prop={{
            setRenderedSongs,
            renderedSongs,
            currentTab,
            searchTerm,
            setSearchTerm
          }}
        />
        <HomepageFooter prop={{ currentTab, setTab }} />
      </div>
    </>
  );
}

export default Home;
