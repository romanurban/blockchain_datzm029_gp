import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { abi } from '../../artifacts/contracts/LendingPlatform.sol/LendingPlatform.json';

// Use environment variables
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
// Private key should be a 64-character hex string without '0x' prefix
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contractAddress = process.env.CONTRACT_ADDRESS!;

const contract = new ethers.Contract(contractAddress, abi, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { amount, interestRate, duration, propertyAddress } = req.body;
        
        // Input validation
        if (!amount || !interestRate || !duration || !propertyAddress) {
            return res.status(400).json({
                error: 'Missing required parameters',
                required: ['amount', 'interestRate', 'duration', 'propertyAddress']
            });
        }

        console.log('Creating loan:', {
            amount,
            interestRate,
            duration,
            propertyAddress
        });

        const amountInWei = ethers.utils.parseEther(amount.toString());
        
        // Create loan directly
        const tx = await contract.createLoan(
            amountInWei,
            ethers.BigNumber.from(interestRate),
            ethers.BigNumber.from(duration),
            propertyAddress,
            {
                gasLimit: 500000
            }
        );

        const receipt = await tx.wait();
        const event = receipt.events?.find((e: { event: string; }) => e.event === 'LoanCreated');

        res.status(200).json({
            message: 'Loan created successfully',
            loanId: event?.args.loanId.toString(),
            borrower: event?.args.borrower,
            amount: ethers.utils.formatEther(event?.args.amount),
            tx: tx.hash
        });
    } catch (error) {
        console.error('Create loan error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error
        });
    }
}