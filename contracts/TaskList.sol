pragma solidity ^0.5.11;

import '../node_modules/@openzeppelin/contracts/payment/escrow/Escrow.sol';
import './PPCToken.sol';

contract TaskList {
	uint8 public task_count = 0;
	enum State { created, accepted, completed, reviewed }
	uint8[] ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	// enum Difficulty { standard, advanced , expert }
	// enum Uncertainity { clear, uncertain, unknown }
	PPCToken private ppctoken = new PPCToken();

	struct Task {
		uint8 id;
		string title;
		string description;
		State state;
		uint deadline;
		uint8 rating;
		mapping(address => bool) validators_map;
		address[] validators;
		mapping(address => bool) workers_map;
		address[] workers;
		Escrow escrow;
		//uint predecessor_id;
		//uint successor_id;
	}

	mapping(uint => Task) public tasks;

	event TaskCreated(
		uint id,
		string title,
		State state,
		address[] validators
	);

	event Test(bool is_true);

	modifier validatorsOnly(uint8 _id) {
		// checks that the sender is a validator of task
		require(tasks[_id].validators_map[msg.sender], "caller is not a validator of this task");
		_;
	}

	event TaskState(
		uint8 id,
		State state
	);

	event validatorAdded(
		uint8 task_id,
		address validator
	);

	event workerAdded(
		uint8 task_id,
		address worker
	);

	event taskFunded(
		uint8 task_id,
		address sender,
		address receiver,
		uint256 amount
	);

	function createTask(string memory _title, string memory _description) public {
		uint8 _id = task_count;
		Task memory task = Task(_id, _title, _description, State.created, 0, 0, new address[](0), new address[](0), new Escrow());
		// https://medium.com/loom-network/ethereum-solidity-memory-vs-storage-how-to-initialize-an-array-inside-a-struct-184baf6aa2eb
		tasks[_id] = task;
		task_count++;
		tasks[_id].validators.push(msg.sender);
		tasks[_id].validators_map[msg.sender] = true;
		emit TaskCreated(_id, _title, State.created, tasks[_id].validators);
	}

	function getValidators(uint8 _id) public view returns (address[] memory) {
		return tasks[_id].validators;
	}

	function addValidator(uint8 _task_id, address _validator) public validatorsOnly(_task_id) {
		Task storage _task = tasks[_task_id];
		_task.validators.push(_validator);
		_task.validators_map[_validator] = true;
		emit validatorAdded(_task_id, _validator);
	}

	function addWorker(uint8 _task_id, address _worker) public validatorsOnly(_task_id) {
		Task storage _task = tasks[_task_id];
		_task.workers.push(_worker);
		emit workerAdded(_task_id, _worker);
	}

	function fundTaskEscrow(uint8 _task_id) public payable {
		// stores funds for the given task its corresponding escrow
		Task storage _task = tasks[_task_id];

		_task.escrow.deposit.value(msg.value)(_task.workers[0]);
		// the 1st worker will get the payment -> add split payment later
		emit taskFunded(_task_id, msg.sender, _task.workers[0], msg.value);
	}

	function getTaskDeposit(uint8 _task_id) public view returns (uint256) {
		Task memory _task = tasks[_task_id];
		return _task.escrow.depositsOf(_task.workers[0]);
	}

	function acceptTask(uint _id) public {

	}

	function completeTask(uint _id) public {

	}

	function reviewTask(uint _id) public {

	}

	function toggleStarted(uint8 _id) public {
		Task storage _task = tasks[_id];
		_task.state = State.accepted;
		// tasks[_id] = _task;
		emit TaskState(_id, _task.state);
	}

}