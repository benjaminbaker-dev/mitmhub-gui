const { app, BrowserWindow, ipcRenderer } = require('electron')
var sudo = require('sudo-prompt');
var options = {
  name: 'MITMhub'
};


function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 650,
      webPreferences: {
        nodeIntegration: true,
        preload: __dirname + '/preload.js'
      }
    })

    
    sudo.exec('python3 /Users/benjaminbaker/Desktop/mitmhub/server.py', options, 
      function(error, stdout, stderr) {
        if (error) {
          throw error;
        } 
      }
    );
    ipcRenderer.on('setup', () => {
      console.log("d")
    });
    win.loadURL("http://localhost:3000")
 
  }

  
  app.whenReady().then(createWindow)