pragma solidity ^0.5.11;

import '../client/node_modules/@openzeppelin/contracts/payment/escrow/Escrow.sol';

contract Task{
	enum State { created, accepted, completed, reviewed }
	uint8[] ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	// enum Difficulty { standard, advanced , expert }
	// enum Uncertainity { clear, uncertain, unknown }

	uint8 id;
	string title;
	string description;
	State state;
	uint deadline;
	uint8 rating;
	mapping(address => bool) public validators_map;
	address[] public validators;
	mapping(address => bool) public workers_map;
	address[] public workers;
	address payable payee;
	Escrow escrow;
	//uint predecessor_id;
	//uint successor_id;

	modifier validatorsOnly() {
		// checks that the sender is a validator of task
		require(validators_map[msg.sender], "caller is not a validator of this task");
		_;
	}

	event TaskCreated(
		uint id,
		string title,
		State state,
		address[] validators
	);

	event Test(bool is_true);

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
		address payee,
		uint256 amount
	);

	constructor(uint8 _id, string memory _title, string memory _description) public {
		id = _id;
		title = _title;
		description = _description;
		state = State.created;
		// new address[](0)
		// https://medium.com/loom-network/ethereum-solidity-memory-vs-storage-how-to-initialize-an-array-inside-a-struct-184baf6aa2eb
		validators.push(msg.sender);
		validators_map[msg.sender] = true;
		escrow = new Escrow();
		emit TaskCreated(_id, _title, State.created, validators);
	}

	function getValidators() public view returns (address[] memory) {
		return validators;
	}

	function addValidator(address _validator) public validatorsOnly {
		validators.push(_validator);
		validators_map[_validator] = true;
		emit validatorAdded(id, _validator);
	}

	function addWorker(address _worker) public validatorsOnly {
		workers.push(_worker);
		emit workerAdded(id, _worker);
	}

	function addPayee(address payable _payee) public {
		payee = _payee;
	}

	function fundTaskEscrow() public payable {
		// stores funds for the given task its corresponding escrow
		escrow.deposit.value(msg.value)(payee);
		emit taskFunded({task_id: id, sender: msg.sender, payee: payee, amount: msg.value});
	}

	function getTaskDeposit() public view returns (uint256) {
		return escrow.depositsOf(payee);
	}

	function acceptTask(uint _id) public {

	}

	function completeTask(uint _id) public {

	}

	function reviewTask(uint _id) public {

	}

	function toggleStarted() public {
		state = State.accepted;
		// tasks[_id] = _task;
		emit TaskState({id: id, state: state});
	}

}