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