import axios from 'axios';
import Qs from 'qs'; 
var instance = axios.create({
    baseURL: import.meta.env.VITE_APP_REQUEST_URL,
    timeout: 4000,
  });
export default instance 
