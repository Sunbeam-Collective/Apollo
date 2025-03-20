import save_icon from "../assets/save.svg";
import save_icon_active from "../assets/save_icon_active.svg";
import {
  getLocalStorageData,
  addSongToLocal,
} from "../utils/localStorageHelpers";

const SaveButton = ({ prop }) => {
  const { id, setRenderedSongs, currentTab } = prop;

  const handleSave = (event) => {
    if (event.target.closest(".save-icon")) {
      console.log("Save");

      const id = event.target.closest(".save-icon").dataset.songId;

      event.target.closest(".save-icon").src = save_icon_active;
      event.target.closest(".save-icon").className = "save-icon-active";

      const localStorageData = getLocalStorageData();
      const idArray = localStorageData.map((song) => song.id);

      if (idArray.includes(Number(id))) {
        return;
      } else {
        addSongToLocal(Number(id));
      }
    } else if (event.target.closest(".save-icon-active")) {
      console.log("Delete");

      const songId = Number(
        event.target.closest(".save-icon-active").dataset.songId
      );

      event.target.closest(".save-icon-active").src = save_icon;
      event.target.closest(".save-icon-active").className = "save-icon";

      // Check if song already exists
      const localStorageData = getLocalStorageData();
      let removeIndex = undefined;

      localStorageData.forEach((song, index) => {
        const id = song.id;
        if (songId === id) {
          removeIndex = index;
        }
      });

      localStorageData.splice(removeIndex, 1);

      localStorage.setItem("savedSongs", JSON.stringify(localStorageData));
    }

    if (currentTab === "saved") {
      const updatedLocalStorageData = getLocalStorageData();
      setRenderedSongs(updatedLocalStorageData);
    }
  };

  const localStorageData = getLocalStorageData();
  const idArray = localStorageData.map((song) => song.id);

  if (idArray.includes(Number(id))) {
    return (
      <img
        className="save-icon-active"
        onClick={handleSave}
        data-song-id={id}
        style={{
          width: "30px",
        }}
        src={save_icon_active}
        alt="Save Icon"
      />
    );
  } else {
    return (
      <img
        className="save-icon"
        onClick={handleSave}
        data-song-id={id}
        style={{
          width: "30px",
        }}
        src={save_icon}
        alt="Save Icon"
      />
    );
  }
};

export default SaveButton;
