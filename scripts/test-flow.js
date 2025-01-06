const { ethers } = require("hardhat");

async function main() {
    const [admin, borrower] = await ethers.getSigners();
    console.log("Testing with admin:", admin.address);
    console.log("Testing with borrower:", borrower.address);

    // Get contract instance
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const LendingPlatform = await ethers.getContractAt("LendingPlatform", contractAddress);
    
    // Test property address
    const propertyAddress = "123 Test Street";
    
    try {
        // 1. Add property as borrower
        console.log("\nStep 1: Adding property...");
        const addPropertyTx = await LendingPlatform.connect(borrower).addProperty(propertyAddress);
        await addPropertyTx.wait();
        console.log("Property added");

        // 2. Get property hash
        const propertyHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(propertyAddress));
        console.log("Property hash:", propertyHash);

        // 3. Verify property as admin
        console.log("\nStep 2: Verifying property...");
        const verifyTx = await LendingPlatform.connect(admin).verifyProperty(propertyHash);
        await verifyTx.wait();
        console.log("Property verified");

        // 4. Check property status
        const property = await LendingPlatform.properties(propertyHash);
        console.log("\nProperty status:", {
            owner: property.owner,
            isVerified: property.isVerified,
            propertyAddress: property.propertyAddress
        });

        // 5. Create loan
        console.log("\nStep 3: Creating loan...");
        const amount = ethers.utils.parseEther("1.0");
        const interestRate = 5; // 5%
        const duration = 12; // 12 months
        
        const createLoanTx = await LendingPlatform.connect(borrower).createLoan(
            amount,
            interestRate,
            duration,
            propertyAddress
        );
        const receipt = await createLoanTx.wait();
        
        // Get loan ID from event
        const loanCreatedEvent = receipt.events.find(e => e.event === 'LoanCreated');
        const loanId = loanCreatedEvent.args.loanId;
        
        // 6. Check loan details
        const loan = await LendingPlatform.loans(loanId);
        console.log("\nCreated loan details:", {
            id: loan.id.toString(),
            borrower: loan.borrower,
            amount: ethers.utils.formatEther(loan.amount),
            interestRate: loan.interestRate.toString(),
            duration: loan.duration.toString(),
            isActive: loan.isActive,
            isVerified: loan.isVerified,
            propertyAddress: loan.propertyAddress
        });

    } catch (error) {
        console.error("Error:", error);
        if (error.error) {
            console.error("Revert reason:", error.error.reason);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
