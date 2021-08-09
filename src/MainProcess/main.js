const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');

// electron-json-config - npm package
const config = require('electron-json-config');

const fs = require('fs');
const path = require("path");

function createWindow() {

    // Remove menu bar
    //Menu.setApplicationMenu(null);

    let win = new BrowserWindow({
        width: 480,
        height: 120,
        frame: false,
        maximizable: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Try to load the last window position if it exists
    const bounds = config.get('bounds');
    if (bounds !== undefined) {
        win.setBounds(bounds);
    }

    // Get tracks from current folder/music/*
    const getAllFiles = function (dirPath, arrayOfFiles) {
        files = fs.readdirSync(dirPath);

        arrayOfFiles = arrayOfFiles || [];

        files.forEach(function (file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        });

        return arrayOfFiles;
    };

    // If no config exists ask for the music folder at launch
    if (!config.has('music-folder')) {
        showOpen();
    } else {
        // Get tracks inside the music folder
        try {
            global.tracks = getAllFiles(config.get('music-folder'));
            console.log("Config location: " + app.getPath('userData'));
        } catch(error) {
            console.error(error);
            showOpen();
        }

        // Load html file into the window
        win.loadFile('src/RendererProcess/index.html');
    }

    // Set application title
    win.setTitle('WitherPlayer');

    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;

    });

    win.on('close', () => {
        // Save the last window position
        config.set('bounds', win.getBounds());
    });

    // Send back the tracks
    ipcMain.on('tracks', (event, args) => event.returnValue = global.tracks);

    // Check for x button click in the ipcRenderer
    ipcMain.on('exit', (event, args) => app.quit());

    // Check for settings button click in the ipcRenderer
    ipcMain.on('settings', (event, args) => {
        // Open a new small window

        // TEMPORARY JUST OPEN MUSIC FOLDER
        showOpen();
    });

    // Check for minimize button click in the ipcRenderer
    ipcMain.on('minimize', (event, args) => {
        win.minimize();
    });

    // Get volume slider position change to save
    ipcMain.on('volumeChange', (event, args) => {
        config.set('volume', args);
    });

    // Send volume from settings
    ipcMain.on('getVolume', (event, args) => {
        if (config.has('volume')) {
            event.returnValue = config.get('volume');
        } else event.returnValue = 1.0;
    });
}

function showOpen() {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(data => {
        config.set('music-folder', data.filePaths[0]);
        app.quit();
        app.relaunch();
    });
}

app.on('ready', () => createWindow());
