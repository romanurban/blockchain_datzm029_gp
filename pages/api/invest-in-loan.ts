import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { abi } from '../../artifacts/contracts/LendingPlatform.sol/LendingPlatform.json';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contractAddress = process.env.CONTRACT_ADDRESS!;
const contract = new ethers.Contract(contractAddress, abi, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { loanId, amount } = req.body;

        if (!loanId || !amount) {
            return res.status(400).json({ error: 'loanId and amount are required' });
        }

        // Verify loan exists and is active
        const loan = await contract.loans(loanId);
        if (!loan.isActive) {
            return res.status(400).json({
                error: 'Loan is not active',
                details: {
                    loanId,
                    currentAmount: ethers.utils.formatEther(loan.amount),
                    fundedAmount: ethers.utils.formatEther(loan.fundedAmount)
                }
            });
        }

        // Check if investment would exceed loan amount
        const amountInWei = ethers.utils.parseEther(amount.toString());
        const remainingAmount = loan.amount.sub(loan.fundedAmount);
        if (amountInWei.gt(remainingAmount)) {
            return res.status(400).json({
                error: 'Investment would exceed remaining loan amount',
                details: {
                    remainingAmount: ethers.utils.formatEther(remainingAmount),
                    attemptedAmount: amount
                }
            });
        }

        // Make investment
        const tx = await contract.invest(loanId, {
            value: amountInWei,
            gasLimit: 500000
        });
        
        const receipt = await tx.wait();
        
        res.status(200).json({
            message: 'Investment successful',
            loanId,
            amount,
            tx: tx.hash,
            blockNumber: receipt.blockNumber
        });
    } catch (error) {
        console.error('Investment error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            details: JSON.stringify(error, null, 2)
        });
    }
}
