import { v4 as uuidv4 } from 'uuid';

let addressConfig = {};
export function setAddressConfig(config) {

   addressConfig = config;
 
}

export function getSystemAddressByKey(key){
   return addressConfig[key];
}


const LOGO_IMAGE_NAME = "logo.png";
import { copyText } from 'vue3-clipboard'
/**
 * 
 * @param {复制的文本} text 
 * @param {是否弹出通知} notification 
 * @returns 
 */
export function copyTextToClipboard(text, notification = true) {
   copyText(text, undefined, (error, event) => { })
   if (!notification) return
   postMessage({ "action": "notification", "param": { "message": "复制成功", "type": "success" } }, "*")
}
/**
 * 随机id
 * @returns 
 */
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
   let host =getSystemAddressByKey("host");
   if (application.type == 3) return `${host}${application.applicationId}/${page}${newArg}`;
   let url = `${host}desktop/webapplication/${application.applicationId}/index.html`;
   if (arg != null) url = url + "?" + arg;
   return url;
}
/**
 *  生成应用程序icon地址
 * @param {应用程序信息} application 
 * @returns 
 */
export function getApplicationIconUrl(application) {
   let host =getSystemAddressByKey("host");
   return `${host}desktop/webapplication/${application.applicationId}/${LOGO_IMAGE_NAME}`;
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
/**
 * 比较版本
 * @param {原版本} v1 
 * @param {目标版本} v2 
 * @returns 
 */
export const  compareVersion=(v1, v2) =>{
   if (typeof v1 !== 'string') return false;
   if (typeof v2 !== 'string') return false;
   v1 = v1.split('.');
   v2 = v2.split('.');
   const k = Math.min(v1.length, v2.length);
   for (let i = 0; i < k; ++ i) {
       v1[i] = parseInt(v1[i], 10);
       v2[i] = parseInt(v2[i], 10);
       if (v1[i] > v2[i]) return 1;
       if (v1[i] < v2[i]) return -1;        
   }
   return v1.length == v2.length ? 0: (v1.length < v2.length ? -1 : 1);
}
