const { ethers } = require("hardhat");

async function main() {
  const constructorArg = process.argv[2] ? parseInt(process.argv[2], 10) : 42;
  const SampleContract = await ethers.getContractFactory("SampleContract");
  const sample = await SampleContract.deploy(constructorArg);
  await sample.deployed();
  console.log("SampleContract deployed to:", sample.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });