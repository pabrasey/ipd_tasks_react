import React, { Component } from "react";
import { Table } from 'rimble-ui';
import TaskListContract from "./contracts/TaskList.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class TaskRow extends React.Component {
  render() {
    const task = this.props.task;

    /*
    let validators = '';
    task.validators.forEach(validator => {
      validators = validators.concat(validator, '<br>');
    });
    */

    return (
      <tr>
        <td>{ task.title }</td>
      </tr>
    );
  }
}

class TaskTable extends Component {

  render() {

    const rows = [];
    const tasks = this.props.tasks;

    console.log('tasks in TaskTable: ', tasks);

    tasks.forEach((task) => {
      rows.push( <TaskRow task = { task } /> );
    });

    console.log('rows: ', rows);

    return (
      <Table>
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>      
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

    contract.methods.createTask("A new task", "its description").send({ from: accounts[0] });

    const task_count = await contract.methods.task_count().call();
    const tasks = [];

    console.log('task_count: ', task_count);

    for (var i = 1; i <= task_count; i++) {
      const task = await contract.methods.tasks(i).call();
      tasks.push(task);
    }

    console.log('tasks: ', tasks);

    this.setState({ task_count, tasks });

  }

  render() {

    const tasks = this.state.tasks;
    console.log('tasks in render: ', tasks);

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <div className="App">
          <h1>Good to Go!</h1>
          <div>The number of task is: { this.state.task_count }</div>
        </div>
        <div><TaskTable tasks = { tasks } /></div>
      </div>
    );
  }

}

export default App;