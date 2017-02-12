var Electron = require("electron")
var Chokidar = require("chokidar")
var window = undefined

Electron.app.on("ready", function() {
    window = new Electron.BrowserWindow({width: 800, height: 600})
    window.loadURL(`file://${__dirname}/source/index.html`)
    // window.webContents.openDevTools()
    
    Chokidar.watch("./source").on("all", function() {
        console.log("reloading")
        window.reload()
    })
    
    window.on("closed", function() {
        window = null
    })
})

Electron.app.on("window-all-closed", function() {
    Electron.app.quit()
})
