import React, { Component } from "react";
import { Table , Button, notification} from 'antd';

import "./existingRuleTable.css"
import { get_active_rules, remove_rule } from "../api/backend_functions"


const columns = [
  {
    title: 'Rule Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Params',
    dataIndex: 'params',
    key: 'params',
  }
]


export default class ExistingRuleTable extends Component {
  state = {
    selectedRowKeys: null,
    data: []
  }

  componentDidUpdate() {
    get_active_rules(this.props.mac)
      .then(resp => resp.json())
      .then(json_data => {
          const rule_data = json_data["response"]
          let data = []

          for(let rule_index in rule_data) {
              data.push({
                "key": rule_index, 
                "index": rule_index,
                "name": rule_data[rule_index]["filter_name"],
                "params": JSON.stringify(rule_data[rule_index]["filter_args"])
              })
          }
  
          if(JSON.stringify(data) !== JSON.stringify(this.state.data)) {
              this.setState({data: data})
          }

      })
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  removeDeletedRule(deleted_row_index) {
    let data = this.state.data;
    let index_to_remove = -1

    for(let index in data) {
      if(data[index]["key"] === deleted_row_index) {
        index_to_remove = index
        break;
      }
    }

    if(index_to_remove) {
      data.splice(index_to_remove, 1)
      this.setState({data: data})
    }
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div className="table-container">
        <Button type="primary" size='large'
        onClick={e => {
          if(this.state.selectedRowKeys) {
            remove_rule(this.props.mac, this.state.selectedRowKeys[0])
              .then(resp => resp.json())
              .then(json_data => {
                  this.removeDeletedRule(this.state.selectedRowKeys[0])
                  notification.open({"message": json_data["status"]})
            }); 
          } else {
            notification.open({"message": "Select rule to delete"})
          }
          }}>Delete</Button>
        <Table
          rowSelection={rowSelection}
          dataSource={this.state.data}
          columns={columns}
        />
      </div>
    )
  }
}
