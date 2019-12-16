import React, { Component } from "react";
import { Table, EthAddress, Form, Field, Select, Input, Button } from 'rimble-ui';
import Box from '@material-ui/core/Box';
import TaskListContract from "./contracts/TaskList.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class AddressList extends React.Component {
  render() {
    const addresses = this.props.addresses;

    let list = [];
    addresses.forEach((address, index) => {
      list.push(<EthAddress address = { address } key = { index } />);
    });

    return list;
  }
}

class TaskRow extends React.Component {
  render() {
    const task = this.props.task;

    return (
      <tr>
        <td>{ task.id }</td>
        <td>{ task.title }</td>
        <td><AddressList addresses = { task.validators } /></td>
      </tr>
    );
  }
}

class TaskTable extends Component {

  render() {

    const rows = [];
    const tasks = this.props.tasks;

    tasks.forEach((task) => {
      rows.push( <TaskRow task = { task } key = { task.id } /> );
    });

    console.log('rows: ', rows);

    return (
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>      
    )      
  }
}

class UpdateTask extends Component {

  state = { contract: this.props.contract, new_validator: '', task_id: ''};

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { contract } = this.state;
    console.log(contract);
    const accounts = await this.props.web3.eth.getAccounts();
    await contract.methods.addValidator(this.state.task_id, this.state.new_validator).send({ from: accounts[0] });
    window.location.reload(false); 
  }

  render () {

    const tasks = this.props.tasks;
    const tasks_select = [{ value: null, label: "None" }];

    tasks.forEach(task => {
      tasks_select.push({ value: task.id, label: task.title });
    });

    return (
      <Box boxShadow={3} p={3} width={[0.9]}>
        <Form onSubmit={this.handleSubmit}>
          <Field label="Select task (title):">
            <Select 
              name = 'task_id'
              value = { this.state.task_id } 
              onChange = { this.handleChange }
              options= { tasks_select }
              required={ true }
            >
            </Select>
          </Field>
          <br />
          <Field label="Add validator (address):">
            <Input
              name="new_validator"
              type="text"
              value={this.state.new_validator}
              onChange={this.handleChange} 
              required={true}
              placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
            />
          </Field>
          <br />
          <Button type="submit"> Update task </Button>
        </Form>
      </Box>
    )
  }

}

class App extends Component {
  state = { web3: null, accounts: null, contract: null, task_count: 0, tasks: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log('accounts: ', accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TaskListContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TaskListContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

        console.log('instance:', instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getContractData);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  };

  getContractData = async () => {

    const { accounts, contract } = this.state;

    //contract.methods.createTask("A new task", "its description").send({ from: accounts[0] });
    //contract.methods.addValidator(1, "0x299818F98284FC7dbE0721827A5678FD091B91A2").send({ from: accounts[0] });

    const task_count = await contract.methods.task_count().call();
    const tasks = [];

    console.log('task_count: ', task_count);

    for (var i = 1; i <= task_count; i++) {
      const task = await contract.methods.tasks(i).call();
      const validators = await contract.methods.getValidators(i).call();
      task.validators = validators;
      tasks.push(task);
    }

    console.log('tasks: ', tasks);

    this.setState({ task_count, tasks });

  }

  render() {

    const tasks = this.state.tasks;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <div className="App">
          <h1>Good to Go!</h1>
          <div>The number of task is: { this.state.task_count }</div>
        </div>
        <Box p={3} width={[0.9]}>
          <TaskTable tasks = { tasks } />    
        </Box>
        <UpdateTask web3 = {this.state.web3} contract = {this.state.contract} tasks = { tasks } />
      </div>
    );
  }

}

export default App;