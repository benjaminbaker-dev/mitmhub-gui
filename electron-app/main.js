const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')


const fs = require('fs');
const os = require('os')

var sudo = require('sudo-prompt');
var options = {
    name: 'MITMhub'
};

const REQ_INSTALL_CERTFILE = "installed.json"

function areRequirementsInstalled() {
    return fs.existsSync(REQ_INSTALL_CERTFILE)
}

function markRequirementsAsInstalled() {
    fs.writeFileSync(REQ_INSTALL_CERTFILE, JSON.stringify({ "status": "SKRPOP" }))
}

function startServer() {
    sudo.exec('python3 electron-app/mitmhub/server.py', options,
        function (error, stdout, stderr) {
            if (error) {
                throw error;
            }
        });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 650,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('electron-app/build/index.html')

    // wait until gui is up, and then do requirement check
    ipcMain.once('init', (event, args) => {
        if (areRequirementsInstalled()) {
            event.sender.send("asynReply", JSON.stringify({ "installed": true }))
        } else {
            event.sender.send("asynReply", JSON.stringify({ "installed": false }))
        }
    })

    // if requirements are not installed, add listener for os type
    if (!areRequirementsInstalled()) {
        ipcMain.once('setup', (event, args) => {
            let py = spawn('python3', ['electron-app/mitmhub/install_requirements.py', `--os=${args}`])
            py.on('close', (exit_code) => {
                if (exit_code == 0) {
                    markRequirementsAsInstalled()
                    event.sender.send("asynReply", JSON.stringify({ "status": "Success" }))
                    startServer();
                }
                event.sender.send("asynReply", JSON.stringify({ "status": "Success" }))

            })
        });
    } else {
        // if reqs are in place - boot up
        startServer();
    }
}


app.whenReady().then(createWindow)

