import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { abi } from '../../artifacts/contracts/LendingPlatform.sol/LendingPlatform.json';

// Define contract loan type
interface ContractLoan {
    id: ethers.BigNumber;
    borrower: string;
    amount: ethers.BigNumber;
    fundedAmount: ethers.BigNumber;
    interestRate: ethers.BigNumber;
    duration: ethers.BigNumber;
    isActive: boolean;
    propertyHash: string;
    propertyAddress: string;
    isVerified: boolean;
}

/* interface LoanArgs {
    loanId: ethers.BigNumber;
    borrower: string;
    amount: ethers.BigNumber;
    fundedAmount: ethers.BigNumber;
    interestRate: ethers.BigNumber;
    duration: ethers.BigNumber;
} */

const PROVIDER_URL = "http://127.0.0.1:8545";

// Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, {
    name: 'localhost',
    chainId: 31337
});

// Add signer for contract interactions
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
const contractAddress = process.env.CONTRACT_ADDRESS!;

// Validate essential environment variables
if (!process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
    console.error('Missing required environment variables: PRIVATE_KEY or CONTRACT_ADDRESS');
    process.exit(1);
}

// Initialize contract with signer
const contract = new ethers.Contract(contractAddress, abi, signer);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Verify contract deployment
        const code = await provider.getCode(contractAddress);
        if (code.length <= 2) {
            console.error('Contract not properly deployed. Code length:', code.length);
            return res.status(500).json({ 
                error: 'Contract not properly deployed',
                address: contractAddress,
                suggestion: 'Please redeploy the contract and update CONTRACT_ADDRESS'
            });
        }

        try {
            // Try to get loans with explicit error handling
            const loans = await contract.getAllLoans();
            console.log('Raw loans response:', loans);
            
            if (!Array.isArray(loans)) {
                throw new Error(`Invalid loans response: ${typeof loans}`);
            }

            const formattedLoans = loans.map((loan: ContractLoan) => ({
                id: loan.id.toString(),
                borrower: loan.borrower,
                amount: ethers.utils.formatEther(loan.amount),
                fundedAmount: ethers.utils.formatEther(loan.fundedAmount),
                interestRate: loan.interestRate.toString(),
                duration: loan.duration.toString(),
                isActive: loan.isActive,
                propertyHash: loan.propertyHash,
                propertyAddress: loan.propertyAddress,
                isVerified: loan.isVerified
            }));

            return res.status(200).json(formattedLoans);
        } catch (error) {
            console.error('Contract call error:', {
                error,
                contractAddress,
                signerAddress: signer.address
            });
            
            return res.status(500).json({
                error: 'Contract call failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                contractAddress,
                signerAddress: signer.address
            });
        }
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ 
            error: 'Handler error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
