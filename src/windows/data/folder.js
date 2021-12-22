export class LinuxPath {
    constructor(path) {
        this.path = path;
        this.pathBlock = [];
        this.parse();
    }
    range(index) {
        let newBlock = this.pathBlock.slice(0, index + 1);
        this.pathBlock = newBlock;
        if (newBlock.length == 1) {
            this.path = newBlock.join("/");
            return
        }
        this.path = newBlock.join("/").substring(1)

    }
    append(params) {
        if (this.path == "" && params == "/") {
            this.path = "/";
            this.parse();
            return
        }
        if (this.path == "/") {
            this.path = this.path + params
            this.parse();
            return
        }

        this.path = this.path + "/" + params
        this.parse();
    }

    getPath() {
        return this.path;
    }
    parse() {
        if (this.path == "/") {
            this.pathBlock = ["/"]
            return
        }
        let arrs = this.path.split("/")
        arrs[0] = "/"
        this.pathBlock = arrs;
    }
}
export const createPath = (defaultPath = "/") => {
    return new LinuxPath(defaultPath);
}
export class Folder {
    constructor(root, child) {
        this.path = new LinuxPath(root);
        this.child = child;
        this.select = "";
        this.currentSelectName = "";
        this.contextMenuPoint = { x: 0, y: 0 };
        this.contextMenuVisible = false;
        this.folderContextMenuVisible = false
        this.folderContextMenuPoint = { x: 0, y: 0 };
        this.selectFileItem = null;

    }
}
export const createFolder = (root, child) => {
    return new Folder(root, child);
}