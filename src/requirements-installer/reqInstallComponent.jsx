import React, { Component } from 'react';

import { withRouter } from "react-router-dom";
import { Spin } from 'antd';

import "./reqInstall.css"

const { ipcRenderer } = window.require("electron");

class ReqInstaller extends Component {
    componentDidMount() {
        ipcRenderer.send('setup', this.props.os)
        ipcRenderer.on('asynReply', (event, args) => {
            let response = JSON.parse(args)
            if (response["status"] == "Success") {
                this.props.history.push("/app")
            } else {
                this.props.history.push("/setup")
            }
        })
    }

    chooseWarningMessage() {
        if (this.props.os == "osx") {
            return "you must have brew, python and pip installed"
        }
        return "you must have apt-get, python and pip installed"
    }

    render() {
        return (
            <div className="install-container">
                <Spin size="large" />
                <span className="install-text">installing requirements...</span>
                <br />
                <span className="install-warning">{this.chooseWarningMessage()}</span>
            </div>)
    }
}

export default withRouter(ReqInstaller)

