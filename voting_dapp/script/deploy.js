const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {

  const data = fs.readFileSync('candidates.json');
  const candidates = JSON.parse(data).candidates;

  if (!Array.isArray(candidates)) {
    throw new Error("Candidates should be an array");
  }

  const Voting = await ethers.getContractFactory("Vote");

  const Voting_ = await Voting.deploy(candidates, 90);
  console.log("Contract address:", Voting_.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
