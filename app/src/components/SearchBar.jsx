import { useState } from "react";
import { getDeezerSearch } from "../services/deezerService";
import { getDeezerChart } from "../services/deezerService";
import { useEffect } from "react";
import { getLocalStorageData } from "../utils/localStorageHelpers";

const SearchBar = ({ prop }) => {
  const { currentTab, setRenderedSongs, setSongs, searchTerm, setSearchTerm } =
    prop;

  const [error, setError] = useState(null);

  // Fetch from api using search term on enter
  const handleEnter = async (event) => {
    if (event.key === "Enter" && searchTerm) {
      if (currentTab === "trending") {
        // Trigger Loading Animation by cleaning song list
        setRenderedSongs(null);
        const { data, status } = await getDeezerSearch(searchTerm);
        if (data) {
          setSongs(data.data); // Save in case user returns to trending from saved
          setRenderedSongs(data.data); // Render the search results
        }
        if (status !== 200) setError(true);
      }
      if (currentTab === "saved") {
        const localStorageData = getLocalStorageData();
        const searchResults = localStorageData.filter((element) => {
          const title = element.title.toLowerCase();
          return title.includes(searchTerm);
        });
        setRenderedSongs(searchResults);
      }
    }
  };

  // Handle empty search terms
  useEffect(() => {
    if (searchTerm === "") {
      // Trigger Loading Animation by cleaning song list
      setRenderedSongs(null);
      const doFetch = async () => {
        // Deconstruct chart data from Deezer.
        const { data, status } = await getDeezerChart();
        if (data) {
          // Store trending songs in case user returns from saved
          setSongs(data.data);
          // Render trending songs
          setRenderedSongs(data.data);
        }
        if (status !== 200) setError(true);
      };
      // If user switches to trending it will fetch chart data again
      if (currentTab === "trending") {
        doFetch();
        // If user switches to trending it gets data from local storage and renders it
      } else if (currentTab === "saved") {
        // Reset to list to default
        const data = getLocalStorageData();
        setRenderedSongs(data);
      }
    }
  }, [searchTerm]);

  // Error Handler
  if (error) {
    console.warn("Error Fetching Data at SearchBar Component");
  }

  return (
    <div id="search-bar-wrapper">
      <input
        value={searchTerm}
        type="text"
        placeholder={
          currentTab === "trending"
            ? "Search songs..."
            : "Search saved songs..."
        }
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleEnter}
      />
    </div>
  );
};

export default SearchBar;
