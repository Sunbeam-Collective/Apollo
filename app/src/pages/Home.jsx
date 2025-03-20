import {
  useEffect,
  useState,
  useContext
} from "react";

import HomepageHeader from "../components/HomepageHeader";
import HomepageFooter from "../components/HomepageFooter";
import SongList from "../components/SongList";
import { getDeezerChart } from "../services/deezerService";
import SearchBar from "../components/SearchBar";

import {
  SongContext
} from '../context'

function Home() {
  // State to manage array of songs to be rendered
  // lifting songData upwards with context maybe?
  // const [songData, setSongs] = useState(null);
  const { songData, setSongs } = useContext(SongContext);
  const [error, setError] = useState(null);
  const [currentTab, setTab] = useState("trending");

  // Load chart songs on-mount
  useEffect(() => {
    const doFetch = async () => {
      // Deconstruct chart data from Deezer.
      const { data, status } = await getDeezerChart();
      if (data) setSongs(data.data);
      if (status !== 200) setError(true);
    };
    doFetch();
  }, []);

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
