const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')


const fs = require('fs');
const os = require('os')

var sudo = require('sudo-prompt');
var options = {
  name: 'MITMhub'
};

const REQ_INSTALL_CERTFILE = "/.installed.json"
const BACKEND_PATH = "/Users/benjaminbaker/Desktop/mitmhub/"

function areRequirementsInstalled() {
  return fs.existsSync(REQ_INSTALL_CERTFILE)
}

function markRequirementsAsInstalled() {
  fs.writeFileSync(REQ_INSTALL_CERTFILE, JSON.stringify({"status": "SKRPOP"}))
}

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 650,
      webPreferences: {
        nodeIntegration: true
      }
    })
    win.loadFile('electron-app/index.html')
    win.openDevTools()

    //TODO - add listen/response that checks if reqs are installed
    ipcMain.on('setup', (event, args) => {
      let py = spawn('python3', ['electron-app/mitmhub/install_requirements.py', `--os=${args}`])      
      py.on('close', (exit_code) => {
        if(exit_code == 0) {
          markRequirementsAsInstalled()
          event.returnValue = JSON.stringify({"status": "Success"})
        } 
        event.returnValue = JSON.stringify({"status": "Failure"})

      })
     });
    /*
    sudo.exec('python3 mitmhub/server.py', options, 
      function(error, stdout, stderr) {
        if (error) {
          throw error;
        } 
      }
    );
    */
    //win.loadURL("http://localhost:3000")
 
  }

  
  app.whenReady().then(createWindow)


   
   ipcMain.on('aSynMessage', (event, args) => {
    console.log(args);
    event.sender.send('asynReply','Main said: Async message received')
   });