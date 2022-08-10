import { v4 as uuidv4 } from 'uuid';
const serverDomain = import.meta.env.VITE_APP_REQUEST_URL;
const LOGO_IMAGE_NAME = "logo.png";

export function randId() {
   return uuidv4();
}

export function getApplicationIndexUrl(application, arg = null) {
   //如果类型是easy类型
   if (application.type == 3) {
      let url = `${serverDomain}${application.applicationId}/`;
      return url;
   }
   let url = `${serverDomain}desktop/webapplication/${application.applicationId}/index.html`;
   if (arg != null) url = url + "?" + arg;
   return url;
}
export function getApplicationIconUrl(application) {
   return `${serverDomain}desktop/webapplication/${application.applicationId}/${LOGO_IMAGE_NAME}`;
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
export const height16 = (value) => {
   return (value & 0xffff0000) >> 16;
}
export const low16 = (value) => {
   return value & 0x0000ffff;
}