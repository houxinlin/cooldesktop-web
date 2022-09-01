import { v4 as uuidv4 } from 'uuid';
const serverDomain = import.meta.env.VITE_APP_REQUEST_URL;
const LOGO_IMAGE_NAME = "logo.png";
import { copyText } from 'vue3-clipboard'
export function copyTextToClipboard(text, notification = true) {
   copyText(text, undefined, (error, event) => { })
   if (!notification) return
   postMessage({ "action": "notification", "param": { "message": "复制成功", "type": "success" } }, "*")
}
export function randId() {
   return uuidv4();
}
/**
 * 生成应用程序首页地址，html中的所有静态资源也统一走${desktop/webapplication/${application.applicationId}}
 * @param {应用程序信息} application 
 * @param {参数} arg 
 * @param {page名称} page 
 * @returns 
 */
export function getApplicationIndexUrl(application, arg = null, page = "") {
   let newArg = arg != null ? `?${arg}` : "";
   if (application.type == 3) return `${serverDomain}${application.applicationId}/${page}${newArg}`;
   let url = `${serverDomain}desktop/webapplication/${application.applicationId}/index.html`;
   if (arg != null) url = url + "?" + arg;
   return url;
}
/**
 *  生成应用程序icon地址
 * @param {应用程序信息} application 
 * @returns 
 */
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