// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron"

export const electronAPI = {
    sayHello: (msg: string) => {
        ipcRenderer.send('hello', msg)
    },
    onHello: (cb: (ev: Electron.IpcRendererEvent, msg: string) => void) => {
        ipcRenderer.on('hello', cb)
    }
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI)
window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    ipcRenderer.send('show-context-menu')
  })
  
  ipcRenderer.on('context-menu-command', (e, command) => {
    // ...
    console.log({e, command});
  })