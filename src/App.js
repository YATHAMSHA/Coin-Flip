import React, { useState } from 'react';
import { ethers } from 'ethers';
import CoinFlip from './components/CoinFlip';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("An error occurred while connecting to MetaMask.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='coinh1'>Coin Flip Game</h1>
        {account ? (
          <CoinFlip account={account} />
        ) : (
          <button className='connect'onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
}

export default App;
