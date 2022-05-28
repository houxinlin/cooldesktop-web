import { Terminal } from "xterm";
class TerminalInstance {
    get() {
        return new Terminal({
            fontSize: 15,
            rightClickSelectsWord: true,
            letterSpacing: 0,
            allowTransparency: true,
            cursorBlink: true,
            cursorStyle: "bar",
            cols: 65,
            rows: 20,
            rendererType: "dom",
            theme: {
                foreground: "#ffffff",
                background: "#00000000",
            },
        });
    }
}
export function createTerminalInstance() {
    return new TerminalInstance().get()
}