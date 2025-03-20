import { useState } from "react";
import { getDeezerSearch } from "../services/deezerService";
import { getDeezerChart } from "../services/deezerService";
import { useEffect } from "react";

const SearchBar = ({ prop }) => {
  const { setSongs, currentTab } = prop;
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Fetch from api using search term on enter
  const handleEnter = async (event) => {
    if (event.key === "Enter" && searchTerm && currentTab === "trending") {
      // Trigger Loading Animation by cleaning song list
      setSongs(null);
      const { data, status } = await getDeezerSearch(searchTerm);
      if (data) setSongs(data.data);
      if (status !== 200) setError(true);
    }
  };

  // Reset to chart data if search term is empty
  useEffect(() => {
    const doFetch = async () => {
      const { data, status } = await getDeezerChart();
      if (data) setSongs(data.data);
      if (status !== 200) setError(true);
    };
    if (searchTerm === "") {
      doFetch();
    }
  }, [searchTerm]);

  // Error Handler
  if (error) {
    console.warn("Error Fetching Data at SearchBar Component");
  }

  return (
    <div id="search-bar-wrapper">
      <input
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
