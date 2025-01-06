const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const LendingPlatform = await ethers.getContractFactory("LendingPlatform");
  
  // Deploy the contract
  const lending = await LendingPlatform.deploy();
  await lending.deployed();

  console.log("LendingPlatform deployed to:", lending.address);
  
  // Verify the deployment
  console.log("Deployment verified! You can now use this address to interact with the contract.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
