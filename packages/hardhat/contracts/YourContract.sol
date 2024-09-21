// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is ERC721, Ownable {
    // State Variables
    string public greeting = "Building Unstoppable Apps!!!";
    bool public premium = false;
    uint256 public totalCounter = 0;
    mapping(address => uint) public userGreetingCounter;
    uint256 private _tokenIdCounter; // To track the token IDs

    // Events
    event GreetingChange(
        address indexed greetingSetter,
        string newGreeting,
        bool premium,
        uint256 value
    );

    // Constructor: Called once on contract deployment
    constructor(address _owner) ERC721("YourTokenName", "YTN") {
        transferOwnership(_owner);
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    modifier isOwner() {
        require(msg.sender == owner(), "Not the Owner");
        _;
    }

    /**
     * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
     *
     * @param _newGreeting (string memory) - new greeting to save on the contract
     */
    function setGreeting(string memory _newGreeting) public payable {
        // Print data to the hardhat chain console
        console.log(
            "Setting new greeting '%s' from %s",
            _newGreeting,
            msg.sender
        );

        // Change state variables
        greeting = _newGreeting;
        totalCounter += 1;
        userGreetingCounter[msg.sender] += 1;

        // Check for premium status
        premium = msg.value > 0;

        // Emit event
        emit GreetingChange(msg.sender, _newGreeting, premium, msg.value);
    }

    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */
    function withdraw() public isOwner {
        (bool success, ) = owner().call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}

    /**
     * Mint function to create a new token
     * @param to The address that will own the minted token
     */
    function mint(address to) public {
        _tokenIdCounter++;
        _mint(to, _tokenIdCounter);
    }
}
