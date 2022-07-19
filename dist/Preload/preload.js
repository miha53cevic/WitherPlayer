"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Exposes window.api.<functions> to the RendererProcess
electron_1.contextBridge.exposeInMainWorld('api', {
    getTracks: () => electron_1.ipcRenderer.invoke('tracks'),
    exit: () => electron_1.ipcRenderer.send('exit', true),
    settings: () => electron_1.ipcRenderer.send('settings', true),
    minimize: () => electron_1.ipcRenderer.send('minimize', true),
    saveVolume: (volume) => electron_1.ipcRenderer.send('saveVolume', volume),
    getSavedVolume: () => electron_1.ipcRenderer.invoke('getSavedVolume'),
});
