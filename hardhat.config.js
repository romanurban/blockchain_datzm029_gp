require("dotenv").config(); // Load environment variables
require("@nomicfoundation/hardhat-network-helpers");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      forking: {
        url: process.env.SEPOLIA_RPC_URL,
      },
    },
  },
};
