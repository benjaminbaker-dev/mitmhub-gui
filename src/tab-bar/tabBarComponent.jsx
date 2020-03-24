import React, { Component } from "react";
import { Tabs } from 'antd';

import "./tabBar.css"
import NetworkGrid from "../network-grid/networkGridComponent";
import RuleManager from "../rule-mgmt/ruleManagerComponent";

const { TabPane } = Tabs;

export default class TabBar extends Component {
    render () {
        return(
            <Tabs defaultActiveKey="1" className="tabs">
                <TabPane tab="Network" key="1">
                    <NetworkGrid/>
                </TabPane>
                <TabPane tab="Rule Management" key="2">
                    <RuleManager />
                </TabPane>
          </Tabs>
        )
    }
}
