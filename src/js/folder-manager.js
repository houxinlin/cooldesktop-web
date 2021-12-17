import {  folderWindow } from "./window-property";
let folderCollection = Array()
class Folder {
    constructor(root, child) {
        this.root = root;
        this.child = child;
        
    }
}
export const createFolder = (root, child) => {
    return new Folder(root, child);
}

export const addFolder = (folder) => {
    folderCollection.push(folder)
    return folderWindow.getProperty();
}