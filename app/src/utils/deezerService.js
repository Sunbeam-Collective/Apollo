import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
  /**
  * to test locally, make an .env file in the app directory
  * and set BACKEND_URL to http://localhost:{port}
  */
  baseURL: process.env.BACKEND_URL,
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
