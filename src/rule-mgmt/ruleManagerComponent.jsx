import React, { Component } from "react";

import "./ruleManager.css"
import { get_nodes, get_rule_options, add_rule } from "../api/backend_functions"

import { Select, Button, Input, notification, Spin } from 'antd';
import ExistingRuleTable from "../existing-rules/existingRuleTableComponent";

const { Option } = Select;

export default class RuleManager extends Component {
    state = {
        mac_list: [],
        selected_node: null,
        rule_options: {},
        selected_rule: null,
        params: null
    }

    componentDidMount() {
        get_nodes()
            .then(resp => resp.json())
            .then(json_data => {
                let nodes = json_data["network_nodes"]
               
                let mac_list = []
                for(let node of nodes) {
                    mac_list.push(node["mac"])
                }

                this.setState({mac_list: mac_list})

            })
    }

    _updateSelectedNodeAndGetRuleOptions = (new_state) => {
         this.setState(new_state, () => { this._fetchRuleOptions() })
       }

    _fetchRuleOptions() {
        get_rule_options(this.state.selected_node)
            .then(resp => resp.json())
            .then(json_data => {
                this.setState({rule_options: json_data["response"]})
            })
    }

    _generateNodeOptions() {
        let select_list = []
        for(let mac of this.state.mac_list) {
            select_list.push(<Option value={mac} className="menu-text">{mac}</Option>)
        }
        return select_list    
    }

    _generateRuleOptions() {
        if(this.state.selected_node && this.state.rule_options) {
            let rule_list = []
            for(let func_name in this.state.rule_options) {
                rule_list.push(<Option value={func_name} className="menu-text">{func_name}</Option>)
            }
            return rule_list
        } else {
            return []
        }
    }

    _generateParamInput() {
        if(this.state.selected_rule) {
            let param_list = []
            for(let param of this.state.rule_options[this.state.selected_rule]) {
                param_list.push(
                <div>
                    <div className="param-title">{param}</div>
                    <Input onChange={e => this.setState({...this.state, params: {...this.state.params, [param]: e.target.value}})}/>
                    <br/>
                </div>
                )    
            }
            return param_list
        }
    }

    chooseRender() {
        if(this.state.mac_list.length) {
            return(
                <div className="container">
                    <div className="subtitle">
                    Node and Rule
                    </div>
                    <Select defaultValue="Pick node" style={{ width: 200, marginRight: "1vh" }} onChange={e => {this._updateSelectedNodeAndGetRuleOptions({selected_node:e, rule_options: {}, selected_rule: null})}}>
                        {this._generateNodeOptions()}
                    </Select>
                    <Select defaultValue="Pick rule"  style={{ width: 200 }} onChange={e => this.setState({selected_rule: e})}>
                        {this._generateRuleOptions()}
                    </Select>
                    <div className="subtitle">
                    Rule Params
                    </div>
                    {this._generateParamInput()}
                    <div className="submit-div">
                        <Button type="primary" shape="round" size='large' 
                        onClick={e => {
                            if(this.state.selected_rule && this.state.params) {
                                add_rule(this.state.selected_node, this.state.selected_rule, this.state.params)
                                    .then(resp => resp.json())
                                    .then(json_data => {
                                        this.setState({rule_options: {}, selected_rule: null})
                                        notification.open({"message": json_data["status"]})
                                    }); 
                            } else {
                                notification.open({"message": "Please pick rule and fill params"})
                            } 
                          }
                        }>add rule</Button>
                    </div>
                    <ExistingRuleTable mac={this.state.selected_node}/>
                </div>
            )
        } else {
            return(<Spin size="large"/>)
        }
    }


    render() {
        return this.chooseRender()
    }
}