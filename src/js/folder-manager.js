import { folderWindow } from "./window-property";
import { createPath } from "../utils/path";

class Folder {
    constructor(root, child) {
        this.path = createPath(root);
        this.child = child;
        this.select = "";
        this.currentSelectName="";
        this.contextMenuPoint={x:0,y:0};
        this.contextMenuVisible=false;
        this.folderContextMenuVisible=false
        this.folderContextMenuPoint={x:0,y:0};
        this.selectFileItem=null;

    }
}
export const createFolder = (root, child) => {
    return new Folder(root, child);
}

export const getFolderWindowProperty = (folder) => {
    let property = folderWindow.getProperty();
    property.folder = folder;
    return property;
}