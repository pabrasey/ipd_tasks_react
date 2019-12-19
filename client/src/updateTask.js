import React, { Component } from "react";
import { Table, EthAddress, Form, Field, Select, Input, Button, Box } from 'rimble-ui';


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
      <Box boxShadow={3} m={50} p={20}>
        <h3>Update task</h3>
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

export default UpdateTask;

// https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281#36796281