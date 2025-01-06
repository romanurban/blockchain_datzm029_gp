// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 fundedAmount;
        uint256 interestRate;
        uint256 duration;
        bool isActive;
        bytes32 propertyHash;  // Added for real estate
        string propertyAddress; // Added for real estate
        bool isVerified;       // Added for real estate verification
    }

    struct Property {
        bytes32 propertyHash;
        string propertyAddress;
        bool isVerified;
        address owner;
    }

    mapping(uint256 => Loan) public loans;
    mapping(bytes32 => Property) public properties;
    mapping(address => uint256[]) public userLoans;
    uint256[] public allLoanIds;
    uint256 public nextLoanId;
    address public admin;

    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event PropertyAdded(bytes32 indexed propertyHash, string propertyAddress, address indexed owner);
    event PropertyVerified(bytes32 indexed propertyHash);
    event InvestmentMade(uint256 indexed loanId, address indexed lender, uint256 amount);
    event LoanFunded(uint256 indexed loanId);
    event LoanRepaid(uint256 indexed loanId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addProperty(string memory _propertyAddress) public {
        bytes32 propertyHash = keccak256(abi.encodePacked(_propertyAddress));
        require(properties[propertyHash].owner == address(0), "Property already exists");
        
        properties[propertyHash] = Property({
            propertyHash: propertyHash,
            propertyAddress: _propertyAddress,
            isVerified: false,
            owner: msg.sender
        });

        emit PropertyAdded(propertyHash, _propertyAddress, msg.sender);
    }

    function verifyProperty(bytes32 _propertyHash) public onlyAdmin {
        require(properties[_propertyHash].owner != address(0), "Property does not exist");
        properties[_propertyHash].isVerified = true;
        emit PropertyVerified(_propertyHash);
    }

    function createLoan(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _duration,
        string memory _propertyAddress
    ) public {
        bytes32 propertyHash = keccak256(abi.encodePacked(_propertyAddress));

        // Just create the property if it doesn't exist
        if (properties[propertyHash].owner == address(0)) {
            properties[propertyHash] = Property({
                propertyHash: propertyHash,
                propertyAddress: _propertyAddress,
                isVerified: true, // Set to true by default
                owner: msg.sender
            });
        }

        uint256 loanId = nextLoanId++;
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            amount: _amount,
            fundedAmount: 0,
            interestRate: _interestRate,
            duration: _duration,
            isActive: true,
            propertyHash: propertyHash,
            propertyAddress: _propertyAddress,
            isVerified: true // Set to true by default
        });

        userLoans[msg.sender].push(loanId);
        allLoanIds.push(loanId);

        emit LoanCreated(loanId, msg.sender, _amount);
    }

    function invest(uint256 _loanId) public payable {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan is not active");
        require(loan.fundedAmount + msg.value <= loan.amount, "Investment would exceed loan amount");

        loan.fundedAmount += msg.value;
        emit InvestmentMade(_loanId, msg.sender, msg.value);

        if (loan.fundedAmount == loan.amount) {
            payable(loan.borrower).transfer(loan.amount);
            emit LoanFunded(_loanId);
        }
    }

    function repayLoan(uint256 _loanId) public payable {
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(loan.isActive, "Loan is not active");
        
        uint256 totalAmount = calculateTotalRepayment(loan);
        require(msg.value >= totalAmount, "Insufficient repayment amount");

        loan.isActive = false;
        emit LoanRepaid(_loanId);
    }

    function calculateTotalRepayment(Loan memory loan) public pure returns (uint256) {
        uint256 interest = (loan.amount * loan.interestRate * loan.duration) / (12 * 100);
        return loan.amount + interest;
    }

    function getAllLoans() public view returns (Loan[] memory) {
        Loan[] memory allLoans = new Loan[](allLoanIds.length);
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            allLoans[i] = loans[allLoanIds[i]];
        }
        return allLoans;
    }

    function getUserLoans(address _user) public view returns (Loan[] memory) {
        uint256[] storage userLoanIds = userLoans[_user];
        Loan[] memory userLoanList = new Loan[](userLoanIds.length);
        for (uint256 i = 0; i < userLoanIds.length; i++) {
            userLoanList[i] = loans[userLoanIds[i]];
        }
        return userLoanList;
    }
}
