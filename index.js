const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const fs = require("fs")
let win = null

app.on("ready", () => {
  win = new BrowserWindow({title: "forecast", fullscreen: true})
  let locale = process.argv[process.argv.length-1]
  win.loadURL("http://hafen.viwetter.de/forecast/"+locale)
  win.setMenu(null)
  win.on('closed', () => {
    win = null
  })
  setTimeout(()=>{win.capturePage((pic)=>{
    try {
      fs.mkdirSync("pics")
    } catch(e) {
      // folder exists
    }
    let fullPath = "./pics/cap_"+locale+".png"
    fs.writeFile(fullPath, pic.toPNG())
    setTimeout(()=>{
      win.close()
      shell.showItemInFolder(fullPath)
    }, 1000)
  })}, 5000)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
