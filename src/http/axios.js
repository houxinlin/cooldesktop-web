import axios from 'axios';

let instance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 4000,
});

let applicationServer = axios.create({
  baseURL: import.meta.env.VITE_APP_SOFTWARE_SERVER_URL,
  timeout: 4000,
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

export { applicationServer }
