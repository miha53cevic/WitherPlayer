"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// electron-json-config - npm package
const electron_json_config_1 = require("electron-json-config");
const config = (0, electron_json_config_1.factory)();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createWindow() {
    const window = new electron_1.BrowserWindow({
        width: 480,
        height: 120,
        frame: false,
        maximizable: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js')
        }
    });
    // Try to load the last window position if it exists
    const bounds = config.get('bounds');
    if (bounds !== undefined) {
        window.setBounds(bounds);
    }
    ///////////////////////////////////////////////////////////////////////////////////
    // Get tracks from current folder/music/*
    const getAllFiles = (dirPath, arrayOfFiles) => {
        const files = fs_1.default.readdirSync(dirPath);
        files.forEach(file => {
            if (fs_1.default.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
            else {
                arrayOfFiles.push(path_1.default.join(dirPath, "/", file));
            }
        });
        return arrayOfFiles;
    };
    const showOpen = () => __awaiter(this, void 0, void 0, function* () {
        const res = yield electron_1.dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        config.set('music-folder', res.filePaths[0]);
        electron_1.app.quit();
        electron_1.app.relaunch();
    });
    ///////////////////////////////////////////////////////////////////////////////////
    // If no config exists ask for the music folder at launch
    if (!config.has('music-folder')) {
        showOpen();
    }
    else {
        // Get tracks inside the music folder
        try {
            global.Tracks = getAllFiles(config.get('music-folder'), []);
            console.log("Config location: " + electron_1.app.getPath('userData'));
        }
        catch (error) {
            console.error(error);
            showOpen();
        }
        // Load html file into the window
        console.log(__dirname);
        window.loadFile('dist/RendererProcess/index.html');
    }
    // Set application title
    window.setTitle('WitherPlayer');
    window.on('close', () => {
        // Save the last window position
        config.set('bounds', window.getBounds());
    });
    ///////////////////////////////////////////////////////////////////////////////////
    // handle for 2 way, on for 1 way communication
    // invoke for 2 way, send for 1 way communication
    // Send back the tracks
    electron_1.ipcMain.handle('tracks', (event, args) => global.Tracks);
    // Check for x button click in the ipcRenderer
    electron_1.ipcMain.on('exit', () => electron_1.app.quit());
    // Check for settings button click in the ipcRenderer
    electron_1.ipcMain.on('settings', (event, args) => {
        // Open a new small window
        // TEMPORARY JUST OPEN MUSIC FOLDER
        showOpen();
    });
    // Check for minimize button click in the ipcRenderer
    electron_1.ipcMain.on('minimize', (event, args) => {
        window.minimize();
    });
    // Get volume slider position change to save
    electron_1.ipcMain.on('saveVolume', (event, args) => {
        config.set('volume', args);
    });
    // Send volume from settings
    electron_1.ipcMain.handle('getSavedVolume', (event, args) => {
        if (config.has('volume')) {
            return config.get('volume');
        }
        else
            return 1.0;
    });
    ///////////////////////////////////////////////////////////////////////////////////
}
electron_1.app.on('ready', () => createWindow());
