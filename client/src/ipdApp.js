import React, { Component } from "react";
import TaskListContract from "./contracts/TaskList.json";
import PPCTokenContract from "./contracts/PPCToken.json";
import getWeb3 from "./getWeb3";
import TaskTable from "./taskTable";
import UpdateTask from "./updateTask";
import CreateTask from "./createTask";
import BalanceTable from "./balanceTable"

import "./App.css";

class IpdApp extends Component {

  state = { web3: null, accounts: [], contract: null, task_count: 0, tasks: [], ppc_balances: [], tasklist: null };

  componentDidMount = async () => {

    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {

        let _accounts = [ drizzleState.accounts[0], "0x299818F98284FC7dbE0721827A5678FD091B91A2" ];

        this.setState({
          accounts: _accounts,
          tasklist: drizzle.contracts.TaskList,
          ppctoken: drizzle.contracts.PPCToken,
          loading: false, 
          drizzleState
        })

        this.getContractData();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getContractData = async () => {

    const { accounts, tasklist } = this.state;

    const { drizzle } = this.props;

    // let drizzle know we want to watch the `myString` method
    const dataKey = drizzle.contracts.TaskList.methods.task_count.cacheCall();

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey });

    // TaskList

    const task_count = this.state.drizzleState.contracts.TaskList.task_count[this.state.dataKey].value;
    debugger;
    // const task_count = await tasklist.methods.task_count().call();
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
    console.log(accounts.length);
    debugger;
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

    /*
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    */
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

export default IpdApp;