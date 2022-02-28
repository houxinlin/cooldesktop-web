import axios from 'axios';

var instance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 4000,
});
export default instance

var softwareServer = axios.create({
  baseURL: import.meta.env.VITE_APP_SOFTWARE_SERVER_URL,
  timeout: 4000,
});
export { softwareServer }
