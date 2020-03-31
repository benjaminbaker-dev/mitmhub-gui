import React, { Component } from 'react';

import { withRouter } from "react-router-dom";

import './App.css';

import Title from './title/titleComponent';


const { ipcRenderer } = window.require("electron");

class App extends Component {
  componentDidMount() {
    ipcRenderer.send('init', 'hello, world')
    ipcRenderer.on('asynReply', (event, args) => {
      let response = JSON.parse(args)
      let are_reqs_installed = response["installed"]

      if (are_reqs_installed) {
        this.props.history.push("/app")
      } else {
        this.props.history.push("/setup")
      }
    })
  }

  render() {
    return (
      <div className="appContainer">
        <Title />
      </div>
    );
  }
}

export default withRouter(App)
