import { useEffect, useState } from "react";
import HomepageHeader from "../components/HomepageHeader";
import HomepageFooter from "../components/HomepageFooter";
import SongList from "../components/SongList";
import { getDeezerChart } from "../services/deezerService";
import SearchBar from "../components/SearchBar";
import {
  initLocalStorage,
  getLocalStorageData,
} from "../utils/localStorageHelpers";

function Home() {
  // State to manage array of songs to be rendered
  const [songData, setSongs] = useState(null);
  const [error, setError] = useState(null);
  const [currentTab, setTab] = useState("trending");

  // This useEffect loads chart songs on-mount
  useEffect(() => {
    const doFetch = async () => {
      // Deconstruct chart data from Deezer.
      const { data, status } = await getDeezerChart();
      if (data) setSongs(data.data);
      if (status !== 200) setError(true);
    };
    // Fetch chart data
    doFetch();
    // Initialize local storage
    const localStorageData = getLocalStorageData();
    if (!localStorageData) {
      initLocalStorage();
    }
  }, []);

  // This useEffect checks if tab is saved or trending
  useEffect(() => {
    // This triggers the loading animation b/c when songData is null loadingAnim is rendered
    setSongs(null);
    if (currentTab === "trending") {
      const doFetch = async () => {
        // Deconstruct chart data from Deezer.
        const { data, status } = await getDeezerChart();
        if (data) setSongs(data.data);
        if (status !== 200) setError(true);
      };
      // Fetch chart data
      doFetch();
    } else if (currentTab === "saved") {
      const data = getLocalStorageData();
      if (data.length !== 0) {
        setSongs(data);
      } else {
        setSongs([]);
      }
    }
  }, [currentTab]);

  // Render if error is true
  if (error) return <>An Error Has Occurred While Loading the Page</>;

  return (
    <>
      <div id="homepage-container">
        <HomepageHeader />
        <SearchBar prop={{ setSongs, currentTab }} />
        <SongList prop={{ currentTab, songData }} />
        <HomepageFooter prop={{ currentTab, setTab }} />
      </div>
    </>
  );
}

export default Home;
