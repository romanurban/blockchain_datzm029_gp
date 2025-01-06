import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contractAddress = process.env.CONTRACT_ADDRESS!;
const abi = [
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "loans",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "address", "name": "borrower", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "uint256", "name": "fundedAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "interestRate", "type": "uint256"},
            {"internalType": "uint256", "name": "duration", "type": "uint256"},
            {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_loanId", "type": "uint256"}
        ],
        "name": "invest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "name": "loanId", "type": "uint256"},
            {"indexed": false, "name": "lender", "type": "address"},
            {"indexed": false, "name": "amount", "type": "uint256"}
        ],
        "name": "InvestmentMade",
        "type": "event"
    }
];
const contract = new ethers.Contract(contractAddress, abi, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { loanId, amount } = req.body;
        try {
            // Check if loan exists and is active
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

            const tx = await contract.invest(loanId, {
                value: ethers.utils.parseEther(amount.toString())
            });
            
            await tx.wait();
            
            res.status(200).json({ 
                message: 'Investment successful', 
                loanId,
                amount,
                tx: tx.hash
            });
        } catch (error) {
            console.error('Investment error:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
