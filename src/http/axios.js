import axios from 'axios';
import { getSystemAddressByKey } from '../utils/utils';


let instance = axios.create({
  baseURL:  getSystemAddressByKey("host"),
  timeout: 5000,
});

instance.interceptors.response.use(
  response => {
    let contentType = response.headers["content-type"]
    if (contentType != undefined) {
      if (response.headers["content-type"].substr(0, 9) == "text/html") {
        window.location.href = "/"
      }
    }
    return response
  },
  err => {
    return Promise.reject(err)
  })

export default instance
