import React, { Component } from 'react';

import {  Link } from "react-router-dom";
import { Spin, notification } from 'antd';

import "./reqInstall.css"

const { ipcRenderer } = window.require("electron");

export default class ReqInstaller extends Component {
    state = {
        installed: false
    }

    componentDidMount() {
        console.log("here")
        let response = JSON.parse(ipcRenderer.sendSync('setup', this.props.os))
        if(response["status"] == "Success") { 
            this.setState({installed: true})
        }
    }

    chooseWarningMessage() {
        if(this.props.os == "osx") {
            return "you must have brew, python and pip installed"
        }
        return "you must have apt-get, python and pip installed"
    }

    chooseRender() {
        if(this.state.installed) {
            return (
            <div style={{textAlign: "center"}}>
                <span className="install-text">success</span>
                <br/>
                <Link to="/app"><span className="install-warning">take me to mitmhub</span></Link>
            </div>)
        } else {
            return (
            <div className="install-container">
                <Spin size="large" />
                <span className="install-text">installing requirements...</span>   
                <br/>
                <span className="install-warning">{this.chooseWarningMessage()}</span>   
             </div>)
        }
    }

    render () {
        return this.chooseRender()
    }
}