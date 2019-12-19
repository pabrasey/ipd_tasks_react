import React, { Component } from "react";
import TaskListContract from "./contracts/TaskList.json";
import PPCTokenContract from "./contracts/PPCToken.json";
import getWeb3 from "./getWeb3";
import TaskTable from "./taskTable";
import UpdateTask from "./updateTask";
import CreateTask from "./createTask";
import BalanceTable from "./balanceTable"

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, task_count: 0, tasks: [], ppc_balances: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      accounts.push("0x299818F98284FC7dbE0721827A5678FD091B91A2", "0x1AEf5FCA1cd59978214b70bd734334F3f93F88be", 
      "0xebd7F835f3E3c80ab1F2F3F05dd40398EeA4d1F7");
      const networkId = await web3.eth.net.getId();
      console.log('accounts: ', accounts);

      // Get the TaskList instance.
      const TaskListdeployedNetwork = TaskListContract.networks[networkId];
      const tasklist = new web3.eth.Contract(
        TaskListContract.abi,
        TaskListdeployedNetwork && TaskListdeployedNetwork.address,
      );

      // Get the PPCToken instance.
      const PPCTokendeployedNetwork = PPCTokenContract.networks[networkId];
      const ppctoken = new web3.eth.Contract(
        PPCTokenContract.abi,
        PPCTokendeployedNetwork && PPCTokendeployedNetwork.address,
      );

      console.log('ppctoken instance: ', ppctoken);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, tasklist, ppctoken }, this.getContractData);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  };

  getContractData = async () => {

    const { accounts, tasklist } = this.state;

    // TaskList

    const task_count = await tasklist.methods.task_count().call();
    const tasks = [];

    for (var i = 0; i < task_count; i++) {
      const task = await tasklist.methods.tasks(i).call();
      const validators = await tasklist.methods.getValidators(i).call();
      task.validators = validators;
      tasks.push(task);
    }

    console.log('tasks: ', tasks);

    // PPCToken

    //this.state.ppctoken.methods.mint(accounts[3],(1).toString()).send({ from: accounts[0] })

    let ppc_balances = [];
    for(var i = 0; i < accounts.length; i++){
      let balance = await this.state.ppctoken.methods.balanceOf(accounts[i]).call();
      let el = {account: accounts[i], balance: balance};
      ppc_balances.push(el);
    };
    console.log('ppc_balances: ', ppc_balances);

    this.setState({ task_count, tasks, ppc_balances });

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
        <UpdateTask web3 = {this.state.web3} contract = {this.state.tasklist} tasks = { tasks } />
        <CreateTask web3 = {this.state.web3} contract = {this.state.tasklist} />
        <BalanceTable balances = { this.state.ppc_balances } />
      </div>
    );
  }

}

export default App;