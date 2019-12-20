import Web3 from "web3";
import TaskList from "./contracts/TaskList.json";
import PPCToken from "./contracts/PPCToken.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [TaskList, PPCToken],
  polls: {
    accounts: 1500,
  },
};

export default options;
