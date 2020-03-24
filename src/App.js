import React, { Component } from 'react';

import './App.css';
import Title from './title/titleComponent';
import TabBar from './tab-bar/tabBarComponent';


export default class App extends Component {
  render() {
    return (
      <div className="appContainer">
        <Title />
        <TabBar/>
      </div>
    );
  }
}
