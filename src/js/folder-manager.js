import { folderWindow } from "./window-property";
import { createPath } from "../utils/path";

class Folder {
    constructor(root, child) {
        this.path = createPath();
        this.child = child;
        this.select = "";
        this.pathBlock = ["?s"]

    }
}
export const createFolder = (root, child) => {
    return new Folder(root, child);
}

export const addFolder = (folder) => {
    let property = folderWindow.getProperty();
    property.folder = folder;
    return property;
}