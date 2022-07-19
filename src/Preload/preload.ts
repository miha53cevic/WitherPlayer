import { contextBridge, ipcRenderer } from "electron";

// Exposes window.api.<functions> to the RendererProcess
contextBridge.exposeInMainWorld('api', {
    getTracks: () => ipcRenderer.invoke('tracks'),
    exit: () => ipcRenderer.send('exit', true),
    settings: () => ipcRenderer.send('settings', true),
    minimize: () => ipcRenderer.send('minimize', true),
    saveVolume: (volume: number) => ipcRenderer.send('saveVolume', volume),
    getSavedVolume: () => ipcRenderer.invoke('getSavedVolume'),
});