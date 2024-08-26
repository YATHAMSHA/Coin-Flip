import React, { useState } from 'react';
import { ethers, Contract, parseEther } from 'ethers';
import "./CoinFlip.css"

const contractAddress = "0x5a3fe81565235e282e86fd8bc8cd0e042b72893b";
const contractABI = [
  "function flipCoin(bool guess) public payable",
  "event FlipResult(address indexed player, bool win, uint256 amount)"
];

function CoinFlip({ account }) {
  const [amount, setAmount] = useState("");
  const [guess, setGuess] = useState(true);
  const [message, setMessage] = useState("");

  async function handleFlip() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const amountInWei = parseEther(amount);

      // Call the flipCoin function and send the transaction
      const transaction = await contract.flipCoin(guess, { value: amountInWei });

      // Wait for the transaction to be mined
      const receipt = await transaction.wait();

      // Decode the event log using the contract interface
      const iface = new ethers.Interface(contractABI);
      const event = receipt.logs.find(log => log.topics.includes(ethers.id("FlipResult(address,bool,uint256)")));
      
      if (event) {
        const decodedEvent = iface.parseLog(event);
        const win = decodedEvent.args.win;
        const amountWon = ethers.formatEther(decodedEvent.args.amount);
        
        if (win) {
          setMessage(`You won! You received ${amountWon} ETH.`);
        } else {
          setMessage("You lost! Better luck next time.");
        }
      } else {
        setMessage("Transaction completed, but no events were found.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred, please try again.");
    }
  }

  return (
    <div>
      <h2 className='account'>Account: {account}</h2>
      <input className='amount-box'
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div>
        <label className='radio1'>
          <input
            type="radio"
            value="true"
            checked={guess === true}
            onChange={() => setGuess(true)}
          />
          Heads
        </label>
        <label className='radio2'>
          <input
            type="radio"
            value="false"
            checked={guess === false}
            onChange={() => setGuess(false)}
          />
          Tails
        </label>
      </div>
      <button className='flip'onClick={handleFlip}>Flip Coin</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CoinFlip;
