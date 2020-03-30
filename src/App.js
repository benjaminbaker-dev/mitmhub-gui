import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Spin } from 'antd';

import './App.css';


import Title from './title/titleComponent';
import TabBar from './tab-bar/tabBarComponent';
import ReqInstaller from './requirements-installer/reqInstallComponent';
import OsPicker from './os-picker/osPickerComponent';

function generateRoute() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Spin size="large"></Spin>
          </Route>
          <Route path="/setup">
            <OsPicker />
          </Route>
          <Route path="/osx-setup">
            <ReqInstaller os="osx" />
          </Route>
          <Route path="/linux-setup">
            <ReqInstaller os="linux" />
          </Route>
          <Route path="/app">
            <TabBar />
          </Route>
        </Switch>
      </div>
    </Router>)
}

export default class App extends Component {
  render() {
    return (
      <div className="appContainer">
        <Title />
        <TabBar />
      </div>
    );
  }
}
