// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { Greeting } from "tu-rest-rs";

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
    async sayHiRust(name: string) : Promise<Greeting> {
        return await ipcRenderer.invoke("greeting", name)
    }
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
