// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    event FlipResult(address indexed player, bool win, uint256 amount);

    // Function to allow users to flip a coin by sending tokens
    function flipCoin(bool guess) public payable {
        require(msg.value > 0, "You need to bet some ETH");

        // Simulate a coin flip (Heads = true, Tails = false)
        bool coinFlip = (block.timestamp % 2 == 0);

        uint256 betAmount = msg.value;

        if (coinFlip == guess) {
            // Player wins: send back double the bet amount
            uint256 winAmount = betAmount * 2;
            (bool sent, ) = msg.sender.call{value: winAmount}("");
            require(sent, "Failed to send Ether");
            emit FlipResult(msg.sender, true, winAmount);
        } else {
            // Player loses: contract keeps the bet amount
            emit FlipResult(msg.sender, false, 0);
        }
    }

    // Fallback function to allow the contract to accept ETH
    receive() external payable {}
}
