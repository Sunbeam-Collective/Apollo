import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
  // baseURL: "https://netlify-apollo-backend-test.onrender.com",
  baseURL: "http://localhost:4000",
});

export const getDeezerChart = () => api.get("/api/deezer/charts");
export const getDeezerTrack = (id) => api.get(`/api/deezer/tracks/${id}`);
export const getDeezerSearch = (query) =>
  api.get(`/api/deezer/search?q=${query}`);
export const getTrackFile = (url) => api.get(`/api/deezer/download?url=${url}`, {
  responseType: 'blob',
  headers: {
    'Accept': 'audio/mpeg'
  }
})
