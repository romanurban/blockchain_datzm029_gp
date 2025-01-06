require("dotenv").config(); // Load environment variables
require("@nomicfoundation/hardhat-network-helpers");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      forking: {
        url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      },
    },
  },
};
