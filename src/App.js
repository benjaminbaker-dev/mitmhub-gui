import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Spin, Row, Col, Card, notification } from 'antd';

import './App.css';
import linux from './linux.png';
import osx from './osx.png'

import Title from './title/titleComponent';
import TabBar from './tab-bar/tabBarComponent';

const { ipcRenderer } = window.require("electron");


export default class App extends Component {
  render() {
    ipcRenderer.send('setup', "hello");
    return (
      <div className="appContainer">
        <Title />
        <Router>
          <div>
            <div className="site-card-wrapper">
              <Row gutter={16}>
                <Col span={12}>
                  <Card bordered={false} style={{ backgroundColor: "#424242"}}>
                      <img className="image" src={osx}/>
                      <div className="os-title">
                        OSX
                      </div>
                   </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false} style={{ backgroundColor: "#424242"}}>
                    <img className="image" src={linux}/>
                    <div className="os-title">
                      Linux
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/about">
                <h1>about</h1>
              </Route>
              <Route path="/users">
                <h2>users</h2>
              </Route>
              <Route path="/home">
                <h2>Home</h2>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

//     <TabBar/>