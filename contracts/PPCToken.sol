pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";

contract PPCToken is ERC777, Ownable {

    constructor()
    ERC777("PPCToken", "PPC", new address[](0)) // there is no defaultOperators -> empty array
    public
    {
        _mint(msg.sender, msg.sender, 0, "", ""); // initial supply is 0
    }

    function mint
    (
        address _receiver,
        uint256 _amount
    )
    public onlyOwner
    {
        _mint(msg.sender, _receiver, _amount, "", "");
    }
}