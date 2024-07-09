
import './App.css';
import Login from './components/login';
import { useState, useEffect } from 'react';
import { contractAdress, contractABI } from './consts/contract';
import { ethers } from 'ethers';

function App() {
  return (
    <div className="App">
      <h1>welcom to our lovely very beuatifull voting dapp</h1>
      <Login />
    </div>
  );
}

export default App;
