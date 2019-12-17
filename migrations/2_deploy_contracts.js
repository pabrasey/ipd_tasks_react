var TaskList = artifacts.require("./TaskList.sol");
var PPCToken = artifacts.require("./PPCToken.sol");


// https://forum.openzeppelin.com/t/simple-erc777-token-example/746
require('@openzeppelin/test-helpers/configure')({ provider: web3.currentProvider, environment: 'truffle' });

const { singletons } = require('@openzeppelin/test-helpers');

module.exports = async function(deployer, network, accounts) {
  deployer.deploy(TaskList);

  if (network === 'development') {
    // In a test environment an ERC777 token requires deploying an ERC1820 registry
    await singletons.ERC1820Registry(accounts[0]);
  }
  await deployer.deploy(PPCToken);
};
