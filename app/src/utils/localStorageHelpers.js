import { getDeezerTrack } from "./deezerService";

const initLocalStorage = () => {
  localStorage.setItem("savedSongs", JSON.stringify([]));
};

const addSongToLocal = async (songId) => {
  const localStorageData = JSON.parse(localStorage.getItem("savedSongs"));
  const songData = await getDeezerTrack(songId);
  if (songData.status !== 200) {
    console.warn(`error fetching song id-${songId}`);
    return;
  }
  localStorageData.push(songData.data.data);
  localStorage.setItem("savedSongs", JSON.stringify(localStorageData));
};

const getLocalStorageData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("savedSongs"));
  return localStorageData;
};

const updateLocalStorage = (updatedArray) => {
  localStorage.setItem("savedSongs", JSON.stringify(updatedArray));
};

const removeSongFromLocal = (songId) => {
  const localStorageData = JSON.parse(localStorage.getItem("savedSongs"));
  const removeIndex = localStorageData.findIndex((song) => song.id === songId);
  localStorageData.splice(removeIndex, 1);
  localStorage.setItem("savedSongs", JSON.stringify(localStorageData));
};

export {
  getLocalStorageData,
  initLocalStorage,
  addSongToLocal,
  removeSongFromLocal,
  updateLocalStorage,
};
