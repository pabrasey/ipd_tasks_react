import React, { Component } from "react";
import TaskListContract from "./contracts/TaskList.json";
import getWeb3 from "./getWeb3";
import TaskTable from "./taskTable";
import UpdateTask from "./updateTask";
import CreateTask from "./createTask";

import "./App.css";

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

    const task_count = await contract.methods.task_count().call();
    const tasks = [];

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
          <h1>IPD Task Manager</h1>
          <p>The number of tasks is: { this.state.task_count }</p>
        </div>
        <TaskTable tasks = { tasks } />
        <UpdateTask web3 = {this.state.web3} contract = {this.state.contract} tasks = { tasks } />
        <CreateTask web3 = {this.state.web3} contract = {this.state.contract} />
      </div>
    );
  }

}

export default App;