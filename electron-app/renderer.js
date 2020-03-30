const ipc = require('electron').ipcRenderer

let replyDiv = document.querySelector('#reply');

let are_reqs_installed = ipc.sendSync('init', 'hello, world')

if(!are_reqs_installed["installed"]) {
    let install_status = ipc.sendSync('setup', 'osx')
    replyDiv.innerHTML = install_status;
}

