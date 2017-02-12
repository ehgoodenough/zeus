var window = undefined

var Yargs = require("yargs")
var Electron = require("electron")
var Chokidar = require("chokidar")

Electron.app.on("ready", function() {
    window = new Electron.BrowserWindow({width: 16*50, height: 10*50})
    window.loadURL(`file://${__dirname}/source/index.html`)
    
    if(Yargs.argv.mode == "development") {
        window.webContents.openDevTools({detach: true})
        Chokidar.watch("./source").on("all", function() {
            window.reload()
        })
    }
    
    window.on("closed", function() {
        window = null
    })
})

Electron.app.on("window-all-closed", function() {
    Electron.app.quit()
})
