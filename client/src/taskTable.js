import React, { Component } from "react";
import { Table, EthAddress } from 'rimble-ui';

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
      <Table m={50} width={0.9}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Validators</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>      
    )      
  }
}

export default TaskTable;