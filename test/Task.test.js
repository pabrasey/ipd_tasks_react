// @ts-nocheck
const Task = artifacts.require('./Task.sol')

const truffleAssert = require('truffle-assertions');

contract('Task', (accounts) => {

  const validator_0 = accounts[0];
  const validator_1 = accounts[1];
  const worker_1 = accounts[2];
  const worker_2 = accounts[3];
  const payee_1 = accounts[4];

  before(async () => {
    this.task = await Task.new(0, 'A new task', "description");

  })
 
  it('creates tasks', async () => {

    // debug  ( assert.equal(this.task.getValidators(0)[0], accounts[0]) );
    let result = await truffleAssert.createTransactionResult(this.task, this.task.transactionHash);
    truffleAssert.eventEmitted(result, 'TaskCreated');
    // check the event
    /*
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 0)
    assert.equal(event.title, 'A new task')
    assert.equal(event.state.toNumber(), 0)
    assert.equal(event.validators[0], accounts[0])*/
  })

  it('adds validator from the allowed accounts', async () => {
    // validator adds new validator
    let result_1 = await this.task.addValidator(validator_1, {from: validator_0});
    //truffleAssert.eventEmitted(result, 'validatorAdded', { task_id: 0, validator: validator_1 });
    truffleAssert.eventEmitted(result_1, 'validatorAdded', (ev) => {
      return ev.task_id == 0 && ev.validator == validator_1;
    });

    // worker tries to add a validator, which is not permited
    truffleAssert.reverts(
      this.task.addValidator(worker_2, {from: worker_1}), 
      "caller is not a validator of this task"
    );
  })

  it('adds worker from the allowed accounts', async () => {
    // validator adds new worker
    let result_1 = await this.task.addWorker(worker_1, {from: validator_1});
    truffleAssert.eventEmitted(result_1, 'workerAdded', (ev) => {
      return ev.task_id == 0 && ev.worker == worker_1;
    });

    // worker tries to add a validator, which is not permited
    truffleAssert.reverts(
      this.task.addWorker(worker_2, {from: worker_1}), 
      "caller is not a validator of this task"
    );
  })

  it('adds payee', async () => {
    await this.task.addPayee(payee_1);
    this.task.payee = payee_1;
  })
  
  it('funds task', async () => {
    const amount = web3.utils.toWei('10', "ether");
    const balance_before = await web3.eth.getBalance(validator_1);
    let result = await this.task.fundTaskEscrow({from: validator_1, value: amount, gasPrice:0});

    // check account balance
    const balance_after = await web3.eth.getBalance(validator_1);
    let value = Number(balance_before) - Number(balance_after);
    assert.equal(value, amount);

    // check deposited amount
    let deposit = await this.task.getTaskDeposit();
    assert.equal(deposit, amount);
  })

  /*
  it('toggles task started', async () => {
    const task_id = 1
    const result = await this.task.toggleStarted(task_id) // starts the task

    // check the task
    const task = await this.task.tasks(task_id)
    assert.equal(task.state.toNumber(), 1) // checks task state

    // check the event
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), task_id) // checks event task id
    assert.equal(event.state.toNumber(), 1) // check event task state
  })
  */
  
})