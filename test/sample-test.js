const { expect } = require("chai");

describe("SampleContract", function () {
  it("Should return the correct value", async function () {
    const SampleContract = await ethers.getContractFactory("SampleContract");
    const sample = await SampleContract.deploy(42);
    await sample.deployed();

    expect(await sample.someFunction()).to.equal(42);
  });
});
