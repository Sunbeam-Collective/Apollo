import save_icon from "../assets/save.svg";
import save_icon_active from "../assets/save_icon_active.svg";
import {
  getLocalStorageData,
  addSongToLocal,
  removeSongFromLocal,
} from "../utils/localStorageHelpers";
import { SongContext } from "../context";
import { useContext } from "react";

const SaveButton = ({ prop }) => {
  const { id, currentTab } = prop;
  const { savedTabSongs, setSavedTabSongs } = useContext(SongContext);
  const idArray = getLocalStorageData().map((song) => song.id);

  const handleSave = (event) => {
    const saveSong = event.target.closest(".save-icon");
    const removeSong = event.target.closest(".save-icon-active");
    const localStorageData = getLocalStorageData();

    // Handle localStorage
    if (saveSong) {
      const songId = Number(saveSong.dataset.songId);

      const idArray = localStorageData.map((song) => song.id);

      // Only adds song if its not already in saved
      if (!idArray.includes(songId)) {
        addSongToLocal(songId);
      }
    }

    if (currentTab === "trending" && removeSong) {
      const songId = Number(removeSong.dataset.songId);
      removeSongFromLocal(songId);
    }

    if (currentTab === "saved" && removeSong) {
      const songId = Number(removeSong.dataset.songId);

      const updatedSongArray = savedTabSongs.filter(
        (song) => song.id !== songId
      );

      removeSongFromLocal(songId);
      setSavedTabSongs(updatedSongArray);
    }

    // Handle Styles
    if (saveSong) {
      // Change button style
      saveSong.src = save_icon_active;
      // Set class to active (song is now saved)
      saveSong.className = "save-icon-active";
    }

    if (removeSong) {
      // Change button style
      removeSong.src = save_icon;
      // Set class to inactive (song is not saved any longer)
      removeSong.className = "save-icon";
    }
  };

  return (
    <img
      className={idArray.includes(id) ? "save-icon-active" : "save-icon"}
      onClick={handleSave}
      data-song-id={id}
      style={{
        width: "30px",
      }}
      src={idArray.includes(id) ? save_icon_active : save_icon}
      alt="Remove Icon"
    />
  );
};

export default SaveButton;
