var TaskList = artifacts.require("./TaskList.sol");

module.exports = async function(deployer) {
  deployer.deploy(TaskList);
  tasklist = await TaskList.deployed();
  await tasklist.createTask('A new task', "description"); // DOESNT WORK !
};
