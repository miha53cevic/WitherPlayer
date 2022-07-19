import { app, BrowserWindow, ipcMain, dialog } from 'electron';

// electron-json-config - npm package
import { factory } from 'electron-json-config';
const config = factory();

import fs from 'fs';
import path from "path";

function createWindow() {

    const window = new BrowserWindow({
        width: 480,
        height: 120,
        frame: false,
        maximizable: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../Preload/preload.js')
        }
    });

    // Try to load the last window position if it exists
    const bounds = config.get('bounds');
    if (bounds !== undefined) {
        window.setBounds((bounds as Electron.Rectangle));
    }


///////////////////////////////////////////////////////////////////////////////////

    // Get tracks from current folder/music/*
    const getAllFiles = (dirPath: string, arrayOfFiles: string[]) => {

        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        });

        return arrayOfFiles;
    };

    const showOpen = async () => {

        const res = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        config.set('music-folder', res.filePaths[0]);

        app.quit();
        app.relaunch();
    };

///////////////////////////////////////////////////////////////////////////////////

    // If no config exists ask for the music folder at launch
    if (!config.has('music-folder')) {
        showOpen();
    } else {
        // Get tracks inside the music folder
        try {
            global.Tracks = getAllFiles((config.get('music-folder') as string), []);
            console.log("Config location: " + app.getPath('userData'));
        } catch (error) {
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
    ipcMain.handle('tracks', (event, args) => global.Tracks);

    // Check for x button click in the ipcRenderer
    ipcMain.on('exit', () => app.quit());

    // Check for settings button click in the ipcRenderer
    ipcMain.on('settings', (event, args) => {
        // Open a new small window

        // TEMPORARY JUST OPEN MUSIC FOLDER
        showOpen();
    });

    // Check for minimize button click in the ipcRenderer
    ipcMain.on('minimize', (event, args) => {
        window.minimize();
    });

    // Get volume slider position change to save
    ipcMain.on('saveVolume', (event, args) => {
        config.set('volume', args);
    });

    // Send volume from settings
    ipcMain.handle('getSavedVolume', (event, args) => {
        if (config.has('volume')) {
            return config.get('volume');
        } else return 1.0;
    });

///////////////////////////////////////////////////////////////////////////////////
}

app.on('ready', () => createWindow());
