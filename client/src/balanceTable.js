import React, { Component } from "react";
import { Table, EthAddress } from 'rimble-ui';

class BalanceRow extends React.Component {
    render() {
      return (
        <tr>
          <td><EthAddress address = { this.props.balance.account } /></td>
          <td>{ this.props.balance.balance }</td>
        </tr>
      );
    }
  }

class BalanceTable extends Component {

    render() {
  
      const balances = this.props.balances;

      const rows = [];

      balances.forEach((_balance, index) => {
        rows.push( <BalanceRow balance = { _balance } key = { index } /> );
      });

      return (
        <Table m={50} width={0.9}>
          <thead>
            <tr>
              <th>Account</th>
              <th>PPC Amount</th>
            </tr>
          </thead>
          <tbody>
              {rows}
          </tbody>
        </Table>      
      )      
    }
  }
  
  export default BalanceTable;