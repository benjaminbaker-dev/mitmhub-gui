import React, { Component } from "react";
import { Spin, Menu, Row, Col, Card, Dropdown, notification } from 'antd';
import { SyncOutlined } from '@ant-design/icons'

import "./menu.css"
import "./networkGrid.css"
import { get_nodes, get_tags, start_mitm, stop_mitm } from "../api/backend_functions"


export default class NetworkGrid extends Component {
    state = {
        nodes: [],
        selected_node: null
    }

    menu = (
        <Menu className="menu">
          <Menu.Item key="0" className="menu-text"
                     onClick={e => {
                        notification.open({"message": "Getting tags"});
                         get_tags(this.state.selected_node)
                            .then(resp => resp.json())
                            .then(json_data => {
                                notification.open({"message": json_data["status"]})
                                this.componentDidMount()
                            })  
                     }}>
            get tags
          </Menu.Item>
          <Menu.Item key="1" className="menu-text"  
                     onClick={
                         e => start_mitm(this.state.selected_node)
                                 .then(resp => resp.json())
                                 .then(json_data => {
                                     notification.open({"message": json_data["status"]})
                                     this.componentDidMount()
                                 })
                            }>
            start mitm
          </Menu.Item>
          <Menu.Item key="3" className="menu-text"
                     onClick={e => stop_mitm(this.state.selected_node)
                        .then(resp => resp.json())
                        .then(json_data => {
                            notification.open({"message": json_data["status"]})
                            this.componentDidMount()
                        })
                        }>
            stop mitm
          </Menu.Item>
        </Menu>
      );

    componentDidMount() {
        console.log("try");
        get_nodes()
            .then(resp => resp.json())
            .then(json_data => this.setState({nodes: json_data["network_nodes"]}))
            .catch(e => {
                this.setState({nodes: []})
            })
    }
    
    _addTagsToNode(mac, tags) {
        let nodes = this.state.nodes;

        for(let index in nodes) {
            let node = nodes[index]
            if(node["mac"] === mac) {
                node["tags"] = tags
                this.setState({nodes: nodes})
                return;
            }
        }
    }

    _generateTagDivs(tags) {
        let div_array = [] 
        for(let key in tags) {
            let value = tags[key]

            if(value instanceof Array) {
                value = value[0]
            }

            div_array.push(<div>{key}: {value   }</div>)
        }

        return div_array
    }

    _generateCard(node_data) {
        return (
        <Col span={8}>
            <Dropdown overlay={this.menu} trigger={['click']} >
              <Card bordered={false} style={{ backgroundColor: "#424242", marginBottom: "2vh" }}
                    className="card-text"
                    onClick={e => {e.preventDefault(); this.setState({selected_node: node_data["mac"]})}}>
                <div>
                    <strong>{node_data["mac"]} / {node_data["ip"]}</strong> {node_data["is_mitm_running"] && <SyncOutlined spin/>}
                </div>
                <hr className="hrChange"/>   
                {this._generateTagDivs(node_data["tags"])}
            </Card>
          </Dropdown>
          </Col>
        )
    }

    _generateRow(cards) {
        return (
            <Row gutter={16}>
                {cards[0]}
                {cards[1]}
                {cards[2]}
            </Row>
        )
    }

    
    _generateGrid() {
        let rows = []
        let cards = []
        let nodes = this.state.nodes
        
        for(let index in nodes) {
            cards.push(this._generateCard(nodes[index]))
            if((index + 1) % 3 === 0) {
                rows.push(this._generateRow(cards))
                cards = []
            } 
        }

        if(cards) {
            rows.push(this._generateRow(cards))
        }

        return rows
    }

    chooseRender() {
        if(this.state.nodes.length) {
            return this._generateGrid()
        } else {
            this.componentDidMount();
            return(<Spin size="large"/>)
        }
    }

    render() {
        return(
            <div className="site-card-wrapper">
                {this.chooseRender()}
            </div>
        )}
}
