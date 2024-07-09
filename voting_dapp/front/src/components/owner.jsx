import React, { useState } from 'react';

const Owner = ({ owner, account, addCandidate }) => {
  const [candidate, setCandidate] = useState('');

  const handleAddCandidate = () => {
    addCandidate(candidate);
  };

  return (
    <div>
      <h2>Connected Account: {account}</h2>
      <h3>Contract Owner: {owner}</h3>
      <input
        type="text"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
        placeholder="Enter candidate name"
      />
      <button onClick={handleAddCandidate}>Add Candidate</button>
    </div>
  );
};

export default Owner;
