import { useContext, useState } from "react";
import { getDeezerSearch, getDeezerChart } from "../services/deezerService";
import { useEffect } from "react";
import { getLocalStorageData } from "../utils/localStorageHelpers";
import { cleanInput } from "../utils/inputHandlers";
import { SongContext } from "../context";
import reset_searcH_icon from "../assets/reset_search_icon.svg";

const SearchBar = () => {
  const { setRenderedSongs } = useContext(SongContext);
  const { currentTab } = useContext(SongContext);
  // State to manage state of search bar in trending tab
  const { trendingSearch, setTrendingSearch } = useContext(SongContext);
  // State to manage state of search bar in saved tab
  const { savedSearch, setSavedSearch } = useContext(SongContext);
  const { setTrendingTabSongs } = useContext(SongContext);
  const { setSavedTabSongs } = useContext(SongContext);

  const [error, setError] = useState(null);

  const handleChange = (event) => {
    if (currentTab === "trending") setTrendingSearch(event.target.value);
    if (currentTab === "saved") setSavedSearch(event.target.value);
  };

  // Fetch from api using search term on enter
  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      if (currentTab === "trending") {
        setRenderedSongs(null);
        const searchTerm = cleanInput(trendingSearch);
        const { data, status } = await getDeezerSearch(searchTerm);
        if (data) setTrendingTabSongs(data.data); // Save in case user returns to trending from saved
        if (status !== 200) setError(true);
      }
      if (currentTab === "saved") {
        const searchTerm = cleanInput(savedSearch);
        const localStorageData = getLocalStorageData();
        const searchResults = localStorageData.filter((song) => {
          const title = song.title.toLowerCase();
          const author = song.artist.name.toLowerCase();
          return title.includes(searchTerm) || author.includes(searchTerm);
        });
        setSavedTabSongs(searchResults);
      }
    }
  };

  const handleReset = () => {
    if (currentTab === "trending") setTrendingSearch("");
    if (currentTab === "saved") setSavedSearch("");
  };

  // Handle empty search terms
  useEffect(() => {
    if (trendingSearch === "" && currentTab === "trending") {
      const doFetch = async () => {
        setRenderedSongs(null);
        // Deconstruct chart data from Deezer.
        const { data, status } = await getDeezerChart();
        if (data) setTrendingTabSongs(data.data);
        if (status !== 200) setError(true);
      };
      doFetch();
    }
    if (savedSearch === "" && currentTab === "saved") {
      const localStorage = getLocalStorageData();
      setSavedTabSongs(localStorage);
    }
  }, [trendingSearch, savedSearch]);

  // Error Handler
  if (error) {
    console.warn("Error Fetching Data at SearchBar Component");
  }

  return (
    <div id="search-bar-wrapper">
      <input
        value={currentTab === "trending" ? trendingSearch : savedSearch}
        type="search"
        placeholder={
          currentTab === "trending"
            ? "Search songs..."
            : "Search saved songs..."
        }
        onChange={handleChange}
        onKeyDown={handleEnter}
      />
      <button
        id="clear-button"
        onClick={handleReset}
        style={{
          display:
            trendingSearch && currentTab === "trending"
              ? "flex"
              : savedSearch && currentTab === "saved"
              ? "flex"
              : "none",
        }}
      >
        <img src={reset_searcH_icon} alt="reset button" />
      </button>
    </div>
  );
};

export default SearchBar;
