
import './App.css';
import Login from './components/login';
import { useState, useEffect } from 'react';
import { contractAdress, contractABI } from './consts/contract';
import { ethers } from 'ethers';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);


 

  async function MetamaskAuth() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }

  return (
    <div className="App">
      <h1>welcom to our lovely very beuatifull voting dapp</h1>
      <Login connectWallet ={MetamaskAuth} />
    </div>
  );
}

export default App;
