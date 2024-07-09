import './App.css';
import Login from './components/login';
import { useState, useEffect } from 'react';
import { contractAdress, contractABI } from './consts/contract';
import { ethers } from 'ethers';
import HomePage from './components/homepage';
import logEvent from './components/logger';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);

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
        logEvent({ type: 'MetamaskConnected', address });
        canVote();
      } catch (err) {
        console.error(err);
        logEvent({ type: 'Error', message: err.message }); 
      }
    } else {
      console.error("Metamask is not detected in the browser");
      logEvent({ type: 'Error', message: 'Metamask not detected' }); 
    }
  }

  function disconnectWallet() {
    setIsConnected(false);
    setAccount(null);
    logEvent({ type: 'MetamaskDisconnected' });
  }

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function vote() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAdress, contractABI, signer
      );

      const tx = await contractInstance.vote(number);
      await tx.wait();
      logEvent({ type: 'Vote', account, number }); 
      canVote();
    } catch (err) {
      console.error(err);
      logEvent({ type: 'Error', message: err.message }); 
    }
  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAdress, contractABI, signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
    logEvent({ type: 'CanVoteStatus', account, voteStatus }); 
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAdress, contractABI, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      };
    });
    setCandidates(formattedCandidates);
    logEvent({ type: 'CandidatesFetched', candidates: formattedCandidates }); 
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAdress, contractABI, signer
    );
    const status = await contractInstance.getVotingStatus();
    console.log(status);
    setVotingStatus(status);
    logEvent({ type: 'VotingStatus', status }); 
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAdress, contractABI, signer
    );
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
    logEvent({ type: 'RemainingTime', time: parseInt(time, 16) }); 
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
    logEvent({ type: 'AccountsChanged', accounts }); 
  }

  return (
    <div className="App">
      <h1>Welcome to our lovely very beautiful voting dApp</h1>
      {isConnected ? (
        <HomePage
          account={account}
          disconnectWallet={disconnectWallet}
          remainingTime={remainingTime}
          showButton={CanVote}
          candidates={candidates}
          number={number}
          handleNumberChange={(e) => setNumber(e.target.value)}
          voteFunction={vote}
        />
      ) : (
        <Login connectWallet={MetamaskAuth} />
      )}
    </div>
  );
}

export default App;
