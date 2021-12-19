
function basicProperty(obj) {
    obj.minState = false;
    obj.maxState = false;
    obj.actionWindow = true;
    obj.windowTransition = false;
    obj.windowType = "web";
    obj.pointerEvents = false;
    obj.hideWindow = false;
    obj.icon = "";
    obj.id = "";
    obj.x = 0;
    obj.y = 0;
}
function getProperty(obj) {
    let property = {};
    for (const item of Object.keys(obj)) {
        property[item] = obj[item]
    }
    return property;
}
class CWindow {
    constructor() {
        basicProperty(this);
    }
    getProperty() {
        return getProperty(this);
    }
}

class CWindowFolder {
    constructor() {
        this.currentPath = []
        this.windowType = "folder"
        this.icon = "/src/assets/icon/ic-folder.png"
        this.folder = null;
    }
    getProperty() {
        return getProperty(this);
    }
}
class CWindowErrorMessage {
    constructor() {
        this.message = ""
        this.windowType="error-message"
    }
    getProperty() {
        return getProperty(this);
    }
}

let standardWindow = new CWindow();
let folderWindow = new CWindowFolder();
let errorMessageWindow = new CWindowErrorMessage();
export { standardWindow, folderWindow ,errorMessageWindow}