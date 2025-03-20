import { getDeezerTrack } from "../services/deezerService";

const initLocalStorage = () => {
  localStorage.setItem("savedSongs", JSON.stringify([]));
};

const addSongToLocal = async (songId) => {
  const localStorageData = JSON.parse(localStorage.getItem("savedSongs"));
  const songData = await getDeezerTrack(songId);
  localStorageData.push(songData.data.data);
  localStorage.setItem("savedSongs", JSON.stringify(localStorageData));
};

const getLocalStorageData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("savedSongs"));
  return localStorageData;
};

const removeSongFromLocal = () => {};

export {
  getLocalStorageData,
  initLocalStorage,
  addSongToLocal,
  removeSongFromLocal,
};
