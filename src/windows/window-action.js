
import { state } from "./window-manager.js"
let actionMoveId = '';
export class WindowActions {
    setCanResize = (id, can) => {
        this.getAppById(id).instance.canResize = can
    }
    closeWindowByType = (windowType) => {
        let ids = []
        for (let index = 0; index < state.windowsCollection.length; index++) {
            if (state.windowsCollection[index].windowType == windowType) ids.push(index);
        }
        for (const iterator of ids) {
            state.windowsCollection.splice(iterator, 1);
        }
    }
    hideWindow = (status) => {
        if (status) {
            state.windowVisibleState = state.windowsCollection.filter((item) => item.hideWindow == true);
            for (const iterator of state.windowsCollection) {
                iterator.hideWindow = true;
            }
            return;
        }
        for (const iterator of state.windowsCollection) {
            iterator.hideWindow = false;
        }
    };

    getAppById = (id) => {
        let index = state.windowsCollection.findIndex((item) => item.id == id);
        return {
            instance: state.windowsCollection[index],
            index: index,
        };
    };
    setWindowPos = (id) => {
        for (const item of state.windowsCollection) {
            item.actionWindow = false;
            if (id != item.id && item.activityStatus != 1) {
                this.postWindowEvents(item.id, "pause", {});
                item.activityStatus = 1;
            }

        }
        //当前活动id
        state.actionWindowId = id;
        //设置当前为置顶
        let window = this.getAppById(id).instance;
        window.actionWindow = true;

        if (window.activityStatus != 0) {
            window.activityStatus = 0;
            this.postWindowEvents(id, "resume", {});
        }

        //如果是最小化的时候，则显示
        if (this.getAppById(id).instance.minState) {
            this.getAppById(id).instance.minState = false;
            return;
        }

    };


    windowMouseUp = (e, b) => {
        for (const item of state.windowsCollection) {
            item.pointerEvents = false;
        }
    };

    showWindowByApplicationId = (id) => {
        let index = state.windowsCollection.findIndex((item) => { return id === (item.application || {}).applicationId })
        if (index != -1) this.showWindow(state.windowsCollection[index].id);

    }
    //显示Window
    showWindow = (id) => {
        //如果启动器是显示状态
        if (state.appStarterVisible) {
            this.hideWindow(false);
            state.appStarterVisible = false;
        }
        this.setWindowPos(id);
        //如果当前Window已经显示，并且是置顶，则开始动画
        let app = this.getAppById(id);
        if (app.instance.minState) {
            app.instance.minState = false;
        }

    };

    //最小化
    windowMin = (id) => {
        this.getAppById(id).instance.minState = !this.getAppById(id).instance.minState;
        this.getAppById(id).instance.actionWindow = false;
        state.actionWindowId = -1;
    };
    //关闭Window
    closeWindow = (id) => {
        this.postWindowEvents(id, "close", {})
        this.getAppById(id).instance.closeWindowTransition = true;
        setTimeout(() => {
            state.windowsCollection.splice(this.getAppById(id).index, 1);
            if (state.actionWindowId == id) {
                state.actionWindowId = ""
            }
        }, 200);
    };
    //全屏
    windowFullScreen = (id) => {
        for (const item of state.windowsCollection) {
            item.pointerEvents = true;
        }
        let app = this.getAppById(id);
        if (app.instance.maxState) {
            app.instance.maxState = !app.instance.maxState;
            setTimeout(() => {
                app.instance.windowTransition = !app.instance.windowTransition;
                for (const item of state.windowsCollection) {
                    item.pointerEvents = false;
                }
            }, 500);
        } else {
            app.instance.windowTransition = !app.instance.windowTransition;
            setTimeout(() => {
                app.instance.maxState = !app.instance.maxState;
                for (const item of state.windowsCollection) {
                    item.pointerEvents = false;
                }
            }, 10);
        }
    };

    postWindowEvents = (id, name, e) => {
        let events = this.getAppById(id).instance.events
        if (typeof (events) == "function") events(name, e);
    }
    windowMove = (e) => {
        if (e.which == 3) {
            return;
        }
        for (const item of state.windowsCollection) {
            item.pointerEvents = true;
        }

        let odiv = e.target;
        let downDiv = odiv;
        let list = [];
        let canMove = false
        //找到window-item节点
        while (list.findIndex((item) => item == "window-item") == -1) {
            odiv = odiv.parentNode;
            if (list.findIndex((item) => item == "window-title") != -1) {
                if (!canMove) {
                    canMove = true;
                }
            }
            let classList = odiv.classList;
            if (classList == undefined) {
                return;
            }
            list = [...classList];
        }
        actionMoveId = odiv.getAttribute("data-id");
        if (this.getAppById(actionMoveId).instance.maxState) return
        this.setWindowPos(actionMoveId);

        //除了window-body其他都可以移动
        if (!canMove) {
            return;
        }
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = (e) => {
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            if (top <= 23) {
                document.onmousemove = null;
                document.onmouseup = null;
                this.windowFullScreen(actionMoveId);
                return
            }
            this.postWindowEvents(actionMoveId, "move", { left, top })
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
            this.getAppById(actionMoveId).instance.laseMoveTimeStamp = new Date().getTime();
        };
        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}
