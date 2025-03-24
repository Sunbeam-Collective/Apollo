import { useEffect, useState, useContext } from "react";
import HomepageHeader from "../components/HomepageHeader";
import HomepageFooter from "../components/HomepageFooter";
import SongList from "../components/SongList";
import { getDeezerChart } from "../services/deezerService";
import SearchBar from "../components/SearchBar";
import {
  initLocalStorage,
  getLocalStorageData,
} from "../utils/localStorageHelpers";
import { SongContext } from "../context";

function Home() {
  // State to manage array of songs to be rendered (Trending View)
  const { trendingTabSongs, setTrendingTabSongs } = useContext(SongContext);
  // State to manage array of songs to be rendered (Saved View)
  const { savedTabSongs, setSavedTabSongs } = useContext(SongContext);
  // State to manage state of search bar in trending tab
  const { trendingSearch } = useContext(SongContext);
  // State to manage state of search bar in saved tab
  const { savedSearch } = useContext(SongContext);
  // State to manage what gets rendered
  const { renderedSongs, setRenderedSongs } = useContext(SongContext);
  // State to manage trending and saved tabs
  const { currentTab, setTab } = useContext(SongContext);
  // State to manage fetching errors
  const [error, setError] = useState(null);

  // Initialize local storage
  useEffect(() => {
    const localStorageData = getLocalStorageData();
    if (!localStorageData) initLocalStorage();
  }, []);

  // This useEffect will reset the song data to the original state if the user is not searching
  useEffect(() => {
    if (currentTab === "trending" && !trendingSearch) {
      const doFetch = async () => {
        // Deconstruct chart data from Deezer.
        const { data, status } = await getDeezerChart();
        if (data) setTrendingTabSongs(data.data);
        if (status !== 200) setError(true);
      };
      doFetch();
    }

    if (currentTab === "saved" && !savedSearch) {
      const localStorage = getLocalStorageData();
      setSavedTabSongs(localStorage);
    }
  }, [currentTab]);

  // Whenever the current tab or the song data for the trending / saved tab is changed the rendered songs update and re-render accordingly
  useEffect(() => {
    if (currentTab === "trending") setRenderedSongs(trendingTabSongs);
    if (currentTab === "saved") setRenderedSongs(savedTabSongs);
  }, [currentTab, trendingTabSongs, savedTabSongs]);

  return (
    <>
      <div id="homepage-container">
        <HomepageHeader />
        <SearchBar
          prop={{
            currentTab,
            setRenderedSongs,
          }}
        />
        <SongList
          prop={{
            setRenderedSongs,
            renderedSongs,
            currentTab,
            error,
          }}
        />
        <HomepageFooter prop={{ currentTab, setTab }} />
      </div>
    </>
  );
}

export default Home;
