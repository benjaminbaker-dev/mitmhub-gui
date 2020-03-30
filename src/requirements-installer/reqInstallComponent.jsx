import React, { Component } from 'react';

import {  Link } from "react-router-dom";
import { Spin, notification } from 'antd';

import "./reqInstall.css"


export default class ReqInstaller extends Component {
    state = {
        installed: false
    }

    componentDidMount() {
        //start listener for finished install
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
            <div>
                <span className="install-text">success</span>
                <br/>
                <span className="install-warning"><Link to="/app">take me to mitmhub</Link></span> 
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