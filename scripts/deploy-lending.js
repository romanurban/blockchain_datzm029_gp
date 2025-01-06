const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const RealEstateLending = await ethers.getContractFactory("RealEstateLending");
  
  // Deploy the contract
  const lending = await RealEstateLending.deploy();
  await lending.deployed();

  console.log("RealEstateLending deployed to:", lending.address);
  
  // Verify the deployment
  console.log("Deployment verified! You can now use this address to interact with the contract.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
