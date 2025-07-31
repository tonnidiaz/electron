// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export const electronAPI = {
    sayHello: (msg: string) => {
        ipcRenderer.send("hello", msg);
    },
    showEditorCtxMenu: (target: string) => {
        ipcRenderer.send("showEditorCtxMenu", target);
    },
    onShowEditorCtxMenu: (cb: (ev: IpcRendererEvent, act: string, target: string) => void) => {
        ipcRenderer.on("showEditorCtxMenu", cb);
    },
    onHello: (cb: (ev: Electron.IpcRendererEvent, msg: string) => void) => {
        ipcRenderer.on("hello", cb);
    },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
/* window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-context-menu");
}); */

ipcRenderer.on("context-menu-command", (e, command) => {
    // ...
    console.log({ e, command });
});
