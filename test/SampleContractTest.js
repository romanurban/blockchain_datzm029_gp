const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SampleContract", function () {
  it("Should set initial value and update it", async function () {
    const [owner] = await ethers.getSigners();
    const SampleContract = await ethers.getContractFactory("SampleContract");
    // Deploy with an initial value of 42
    const sample = await SampleContract.deploy(42);
    await sample.deployed();

    expect((await sample.getValue()).toNumber()).to.equal(42);

    // Update the value
    await sample.setValue(100);
    expect((await sample.getValue()).toNumber()).to.equal(100);
  });
});