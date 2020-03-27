const {
    app,
    BrowserWindow
} = require('electron');

// electron-json-config - npm package
const config = require('electron-json-config');

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
        }
    });

    // Load html file into the window
    win.loadFile('src/RendererProcess/index.html');

    // Set application title
    win.setTitle('WitherMiniPlayer');

    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });
}

app.on('ready', createWindow);