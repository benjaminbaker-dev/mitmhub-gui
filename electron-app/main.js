const { app, BrowserWindow, ipcMain, net } = require('electron')
const { spawn } = require('child_process')

const fs = require('fs');
const os = require('os')

var sudo = require('sudo-prompt');
var options = {
    name: 'MITMhub'
};

const OSX_PYTHON3 = "/Library/Frameworks/Python.framework/Versions/3.7/bin/python3"
const LINUX_PYTHON3 = "/user/bin/python3"
let PYTHON3 = OSX_PYTHON3

const REQ_INSTALL_CERTFILE = `${os.tmpdir()}/installed.json`

function areRequirementsInstalled() {
    return fs.existsSync(REQ_INSTALL_CERTFILE)
}

function markRequirementsAsInstalled() {
    fs.writeFileSync(REQ_INSTALL_CERTFILE, JSON.stringify({ "status": "SKRPOP" }))
}

function startServer(python3) {
    sudo.exec(`${python3} ${__dirname}/mitmhub/server.py`, options,
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
    win.loadFile(`${__dirname}/react-build/index.html`)

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
        ipcMain.on('setup', (event, args) => {
            if(args == "linux") {
                PYTHON3 = LINUX_PYTHON3
            }
            let py = spawn(`${PYTHON3}`, [`${__dirname}/mitmhub/install_requirements.py`, `--os=${args}`])   
            py.on('error', (err) => {
                event.sender.send("asynReply", JSON.stringify({ "status": "Failure: " + err }))
            })  

            let output = ""
            py.stderr.on('data', (data) => {
                output = output + data
            })

            py.on('close', (exit_code) => {
                if (exit_code === 0) {
                    markRequirementsAsInstalled()
                    event.sender.send("asynReply", JSON.stringify({ "status": "Success" }))
                    startServer(PYTHON3);
                } else {
                    event.sender.send("asynReply", JSON.stringify({ "status": "Failure: " + output }))
                }
            })
        });
    } else {
        // if reqs are in place - boot up
        startServer(PYTHON3);
    }

    win.on('close', () => {
        const req = net.request({
            method: 'POST',
            url: 'http://localhost:9846/shutdown_server',
        }) 

        req.setHeader('Content-Type', 'application/json')
        req.write(JSON.stringify({"id": "YEET"}))
        req.end()

        req.on('response', (resp) => {
            console.log(resp.statusCode)
        })
    })  
}


app.whenReady().then(createWindow)
