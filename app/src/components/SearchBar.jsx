import { useState } from "react";
import { getDeezerSearch } from "../services/deezerService";
import { getDeezerChart } from "../services/deezerService";
import { useEffect } from "react";

const savedData = [
  {
    id: 2461123655,
    title: "Hell N Back (feat. Summer Walker)",
    artist: {
      name: "Bakar",
    },
    album: {
      cover: "https://api.deezer.com/album/489849155/image",
    },
    preview:
      "https://cdnt-preview.dzcdn.net/api/1/1/2/4/5/0/245fea3e7d84dc08f4c64057db81f57a.mp3?hdnea=exp=1742407556~acl=/api/1/1/2/4/5/0/245fea3e7d84dc08f4c64057db81f57a.mp3*~data=user_id=0,application_id=42~hmac=c91c076c87d92763fd4339b77accc9102d08cd07beec97486b0862abaa6aa4c3",
  },
];

const SearchBar = ({ prop }) => {
  const { setSongs, currentTab } = prop;
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Fetch from api using search term on enter
  const handleEnter = async (event) => {
    if (event.key === "Enter" && searchTerm && currentTab === "trending") {
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
    console.warn("Error Fetching Data");
  }

  return (
    <div id="search-bar-wrapper">
      <input
        type="text"
        placeholder="Search..."
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleEnter}
      />
    </div>
  );
};

export default SearchBar;
