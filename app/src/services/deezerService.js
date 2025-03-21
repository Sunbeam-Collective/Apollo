import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:4000",
});

export const getDeezerChart = () => api.get("/api/deezer/charts");
export const getDeezerTrack = (id) => api.get(`/api/deezer/tracks/${id}`);
export const getDeezerSearch = (query) =>
  api.get(`/api/deezer/search?q=${query}`);
