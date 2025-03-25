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

    // Handle localStorage
    if (saveSong) {
      const idArray = getLocalStorageData().map((song) => song.id);

      // Only adds song if its not already in saved
      if (!idArray.includes(id)) {
        addSongToLocal(id);
      }
    }

    if (currentTab === "trending" && removeSong) {
      removeSongFromLocal(id);
    }

    if (currentTab === "saved" && removeSong) {
      const updatedSongArray = savedTabSongs.filter((song) => song.id !== id);

      removeSongFromLocal(id);
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
    <button className="save-button" onClick={handleSave}>
      <img
        className={idArray.includes(id) ? "save-icon-active" : "save-icon"}
        src={idArray.includes(id) ? save_icon_active : save_icon}
        alt="Remove Saved Song Icon"
      />
    </button>
  );
};

export default SaveButton;
