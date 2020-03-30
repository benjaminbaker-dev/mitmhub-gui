import React, { Component } from "react";
import {  Link } from "react-router-dom";
import { Row, Col, Card } from 'antd';

import "./osPicker.css"


export default class OsPicker extends Component {
    render () {
        return (      
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={12}>
                    <Link to="/osx-setup">
                    <Card bordered={false} style={{ backgroundColor: "#424242"}}>
                        <img className="image" src={"https://www.transparentpng.com/download/apple-logo/hRoKDb-apple-logo-transparent.png"}/>
                        <div className="os-title">
                        OSX
                        </div>
                    </Card>
                    </Link>
                </Col>
                <Col span={12}>
                    <Link to="/linux-setup">
                    <Card bordered={false} style={{ backgroundColor: "#424242"}}>
                        <img className="image" src={"https://www.transparentpng.com/download/penguin/grap6l-penguin-hd-image.png"}/>
                        <div className="os-title">
                        Linux
                        </div>
                    </Card>
                    </Link>
                </Col>
            </Row>
        </div>)
    }
}