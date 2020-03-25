const { app, BrowserWindow } = require('electron')
var sudo = require('sudo-prompt');
var options = {
  name: 'MITMhub'
};


function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 650,
      webPreferences: {
        nodeIntegration: true
      }
    })
    
    sudo.exec('python3 /Users/benjaminbaker/Desktop/mitmhub/server.py', options, 
      function(error, stdout, stderr) {
        if (error) {
          throw error;
        } 
      }
    );
    win.loadURL("http://localhost:3000")
  }

  
  app.whenReady().then(createWindow)