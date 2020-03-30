import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Spin } from 'antd';

import './index.css';

import App from './App';
import TabBar from './tab-bar/tabBarComponent';
import ReqInstaller from './requirements-installer/reqInstallComponent';
import OsPicker from './os-picker/osPickerComponent';

ReactDOM.render(
    <Router>
    <App />
    <div>
      {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
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
    </Router>, 
    document.getElementById('root'));

