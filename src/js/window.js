
function basicProperty(obj){
    obj.minState=false;
    obj.maxState=false;
    obj.actionWindow=true;
    obj.windowTransition=false;
    obj.windowType="web"
    obj.icon=""
}
function getProperty(obj) {
    let property={};
    for (const item of Object.keys(obj)) {
        property[item]=obj[item]
    }
    return property;
}
class CWindow{
    constructor(){
        basicProperty(this);
    }
    getProperty() {
        return getProperty(this);
    }
}

class CWindowFolder{
    constructor(){
        this.currentPath=[]
        this.windowType="folder"
    }
    getProperty() {
        return getProperty(this);
    }
}

 let StandardWindow =new CWindow();
 let FolderWindow =new CWindowFolder();

export {StandardWindow,FolderWindow}