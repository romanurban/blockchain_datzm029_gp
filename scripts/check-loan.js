const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const RealEstateLending = await ethers.getContractAt("RealEstateLending", contractAddress);
  
  // Check loan with ID 2 (from your create-loan response)
  const loan = await RealEstateLending.loans(2);
  console.log("Loan details:");
  console.log("Amount:", ethers.utils.formatEther(loan.amount), "ETH");
  console.log("Funded amount:", ethers.utils.formatEther(loan.fundedAmount), "ETH");
  console.log("Interest rate:", loan.interestRate.toString());
  console.log("Is active:", loan.isActive);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
