
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SampleContract {
    uint256 private value;

    constructor(uint256 initialValue) {
        value = initialValue;
    }

    function setValue(uint256 newValue) public {
        value = newValue;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}