const hre = require("hardhat");

async function main() {
  const contractAddress = "0xEF8960327aBb4fa99af30e531905975bFDaF8613"; // Replace with your deployed contract address
  const SampleContract = await hre.ethers.getContractAt("SampleContract", contractAddress);

  // Example interaction: Call a function from your contract
  const value = await SampleContract.getValue();
  console.log("Value from contract:", value);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
