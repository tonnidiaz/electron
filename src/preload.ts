// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import { HandlerKey, HandlerParams, HandlerReturn } from "./utils/main/types";
// import { Greeting } from "tu-rest-rs";
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
    async sayHiRust(name: string) : Promise<any> {
        return await ipcRenderer.invoke("greeting", name)
    },
    /* async initDb() : Promise<string> {
        return await ipcRenderer.invoke("init_db")
    }, */
    async invoke<K extends HandlerKey>(ev: K, ...args: HandlerParams<K>): Promise<HandlerReturn<K>>{
        const r = await ipcRenderer.invoke(ev, ...args);
        return r
        // if (!r.ok){
        //     console.log("error:",r.data)
        //     console.log('throwing...')
        //     throw {message: r.data}
        // }
        // else{
        //     return r
        // }

    },
    
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
