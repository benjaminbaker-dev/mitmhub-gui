import React, { Component } from "react";

import "./ruleManager.css"
import { get_nodes, get_rule_options, add_rule } from "../api/backend_functions"

import { Select, Button, Input, notification, Spin } from 'antd';
import ExistingRuleTable from "../existing-rules/existingRuleTableComponent";

const { Option } = Select;
const defaultRule = "Pick rule"

export default class RuleManager extends Component {
    state = {
        mac_list: [],
        selected_node: null,
        rule_options: null,
        selected_rule: defaultRule,
        params: null
    }

    resetState() {
        this.setState({
            mac_list: [],
            selected_node: null,
            rule_options: null,
            selected_rule: null,
            params: null
        })
    }

    refreshNodes() {
        get_nodes()
            .then(resp => resp.json())
            .then(json_data => {
                let nodes = json_data["network_nodes"]
                let mac_list = []

                for (let node of nodes) {
                    mac_list.push(node["mac"])
                }

                if(JSON.stringify(this.state.mac_list) !== JSON.stringify(mac_list)) {
                    this.setState({ mac_list: mac_list })
                }      
            })
            .catch(e => {
                this.resetState()
            })
    }
    
    componentDidMount() {
        this.refreshNodes()
    }

    _updateSelectedNodeAndGetRuleOptions = (new_state) => {
        this.setState(new_state, () => { this._fetchRuleOptions() })
    }

    _fetchRuleOptions() {
        get_rule_options(this.state.selected_node)
            .then(resp => resp.json())
            .then(json_data => {
                if(JSON.stringify(this.state.rule_options) !== JSON.stringify(json_data["response"])) {
                    this.setState({ rule_options: json_data["response"] })
                }
            })
            .catch(e => {
                this.resetState()
            })
    }

    _generateNodeOptions() {
        let select_list = []
        for (let mac of this.state.mac_list) {
            select_list.push(<Option value={mac} className="menu-text">{mac}</Option>)
        }
        return select_list   
    }

    _generateRuleOptions() {
        if (this.state.selected_node && this.state.rule_options) {
            let rule_list = []
            for (let func_name in this.state.rule_options) {
                rule_list.push(<Option value={func_name} className="menu-text">{func_name}</Option>)
            }
            return rule_list
        } else {
            return []
        }
    }

    _generateParamInput() {
        if (this.state.selected_rule !== defaultRule) {
            let param_list = []
            const description = this.state.rule_options[this.state.selected_rule]["param_explanation"]
            
            param_list.push(
                <div className="param-desc">
                    {description}
                </div>
            )
    
            for (let param of this.state.rule_options[this.state.selected_rule]["filter_params"]) {
                param_list.push(
                    <div>
                        <div className="param-title">{param}</div>
                        <Input onChange={e => this.setState({ ...this.state, params: { ...this.state.params, [param]: e.target.value } })} />
                        <br />
                    </div>
                )
            }
            return param_list
        }
    }

    chooseRender() {
        if (this.state.mac_list.length) {
            return (
                <div className="container">
                    <div className="subtitle">
                        Node and Rule
                    </div>
                    <Select
                        defaultValue="Pick node"
                        style={{ width: 200, marginRight: "1vh" }}
                        showSearch
                        onFocus={e => this.refreshNodes()}
                        onChange={e => { this._updateSelectedNodeAndGetRuleOptions({ selected_node: e, rule_options: null, selected_rule: defaultRule }) }}>
                        {this._generateNodeOptions()}
                    </Select>
                    <Select
                        style={{ width: 200 }}
                        value={this.state.selected_rule}
                        showSearch
                        onFocus={e => this._fetchRuleOptions()}
                        onChange={e => this.setState({ selected_rule: e })}>
                        {this._generateRuleOptions()}
                    </Select>
                    <div className="subtitle">
                        Rule Params
                    </div>
                    {this._generateParamInput()}
                    <div className="submit-div">
                        <Button type="primary" shape="round" size='large'
                            onClick={e => {
                                if (this.state.selected_rule && this.state.params) {
                                    add_rule(this.state.selected_node, this.state.selected_rule, this.state.params)
                                        .then(resp => resp.json())
                                        .then(json_data => {
                                            if(json_data["status"] === "Successfully added rule") {
                                                this.setState({ rule_options: {}, selected_rule: defaultRule})
                                            }
                                            notification.open({ "message": json_data["status"] })
                                        });
                                } else {
                                    notification.open({ "message": "Please pick rule and fill params" })
                                }
                            }
                            }>add rule</Button>
                    </div>
                    <ExistingRuleTable mac={this.state.selected_node} />
                </div>
            )
        } else {
            return (
                <div className="container">
                    <Spin size="large" />
                </div>
            )
        }
    }

    render() {
        return this.chooseRender()
    }
}

