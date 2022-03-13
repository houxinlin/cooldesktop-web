import axios from 'axios';

var instance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 4000,
});

var applicationServer = axios.create({
  baseURL: import.meta.env.VITE_APP_SOFTWARE_SERVER_URL,
  timeout: 4000,
});

export default instance

export { applicationServer }
