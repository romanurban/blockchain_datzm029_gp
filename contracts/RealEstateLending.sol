// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateLending {
    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 fundedAmount;
        uint256 interestRate;
        uint256 duration;
        bool isActive;
        mapping(address => uint256) lenders;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    event LoanCreated(uint256 loanId, address borrower, uint256 amount);
    event InvestmentMade(uint256 loanId, address lender, uint256 amount);

    function createLoan(uint256 _amount, uint256 _interestRate, uint256 _duration) external {
        loanCounter++;
        Loan storage newLoan = loans[loanCounter];
        newLoan.id = loanCounter;
        newLoan.borrower = msg.sender;
        newLoan.amount = _amount;
        newLoan.interestRate = _interestRate;
        newLoan.duration = _duration;
        newLoan.isActive = true;
        
        emit LoanCreated(loanCounter, msg.sender, _amount);
    }

    function invest(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan is not active");
        require(loan.fundedAmount + msg.value <= loan.amount, "Investment exceeds required amount");

        loan.lenders[msg.sender] += msg.value;
        loan.fundedAmount += msg.value;

        if (loan.fundedAmount == loan.amount) {
            loan.isActive = false;
            // Transfer funds to borrower
            payable(loan.borrower).transfer(loan.amount);
        }

        emit InvestmentMade(_loanId, msg.sender, msg.value);
    }
}
