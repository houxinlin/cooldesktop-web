import { v4 as uuidv4 } from 'uuid';
let serverDomain = import.meta.env.VITE_APP_REQUEST_URL

export function randId() {
   return uuidv4()
}

export function getApplicationIndexUrl(application, arg = null) {

   let url = `${serverDomain}desktop/webapplication/${application.applicationId}/index.html`

   if (arg != null) {
      url = url + "?" + arg
   }
   return url
}
export function getApplicationIconUrl(application) {
   return `${serverDomain}desktop/webapplication/${application.applicationId}/logo.png`

}

export const sizeFormate = (size) => {
   if (size < 1024) {
      return size + "字节";
   }
   if (size / 1024 < 1024) {
      return Math.floor(size / 1024) + "KB";
   }
   return Math.round(size / 1024 / 1024) + "MB";
};