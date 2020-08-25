require('events').EventEmitter.defaultMaxListeners = 15;

const url   = require("url");
const path  = require("path");
const fs    = require("fs");
const child_process = require('child_process');


const {app,BrowserWindow,ipcMain,globalShortcut } = require('electron');

app.allowRendererProcessReuse = true;
app._maxListeners = 100;

let  mainWindow = null; // Default MainWindow is Empty

const gotTheLock = app.requestSingleInstanceLock(); // prevent with duplicate window

class Pages {
    home(){
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname,"app",'index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
}
const pge = new Pages();
function openMainWindow(){
    function setting(f){
        return {
            height: 645, 
            width: 1000,
            center: true, 
            resizable: false,
            alwaysOnTop:false,
            frame: f ? f : false,
            autoHideMenuBar: true, darkTheme:true,
            webPreferences: {nodeIntegration: true,
                devTools : false
            }
        }
    }
    mainWindow = new BrowserWindow(setting(false));
    mainWindow.openDevTools(false);
    pge.home()
    mainWindow.setAlwaysOnTop(false);
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    globalShortcut.register('e', () => {
        mainWindow.webContents.send("test_process",{"status":true})
    })

}
if (!gotTheLock) {
    app.quit();
}else{
    app.on("ready",openMainWindow);
    app.on('activate', function () {
        if (mainWindow === null) {
            openMainWindow()
        }
    })   
    app.on("before-quit", () => {
        globalShortcut.unregister("e");
    })
    app.on('window-all-closed', () => {
        app.quit()
    })   
}