const apiServer = "http://localhost:9846/api"

function get_nodes() {
    const url = apiServer + "/network"
    return fetch(url);
}

function get_tags(mac) {
    const url = apiServer + "/fill_tags"
    const req_json = {"node_id": mac}

    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
}

function get_rule_options(mac) {
    const url = apiServer + "/get_rules"
    const req_json = {"node_id": mac}

    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
}

function add_rule(mac, filter_name, param_dict) {
    const url = apiServer + "/set_rule"
    const req_json = {
        "node_id": mac,
        "request": {
            [filter_name]: param_dict
        }
    }

    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
}

function remove_rule(mac, filter_index) {
    const url = apiServer + "/remove_rule"
    const req_json = {
        "node_id": mac,
        "request": {
            filter_index: filter_index
        }
    }
    
    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
}

function get_active_rules(mac) {
    const url = apiServer + "/get_running_rules"
    const req_json = {
        "node_id": mac,
    }

    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
    
}

function start_mitm(mac) {
    const url = apiServer + "/start_mitm"
    const req_json = {
        "node_id": mac
    }
    
    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
    
}

function stop_mitm(mac) {
    const url = apiServer + "/stop_mitm"
    const req_json = {
        "node_id": mac
    }
    
    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req_json)
    })
}

export { get_nodes, get_rule_options, add_rule, remove_rule, get_active_rules, get_tags, start_mitm, stop_mitm }