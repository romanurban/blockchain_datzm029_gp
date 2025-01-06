const hre = require("hardhat");

async function main() {
  const contractAddress = "your_deployed_contract_address_here"; // Replace with your deployed contract address
  const SampleContract = await hre.ethers.getContractAt("SampleContract", contractAddress);

  // Example interaction: Call a function from your contract
  const value = await SampleContract.someFunction();
  console.log("Value from contract:", value);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
