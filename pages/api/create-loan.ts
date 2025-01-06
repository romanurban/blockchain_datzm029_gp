import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

// Use environment variables
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
// Private key should be a 64-character hex string without '0x' prefix
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contractAddress = process.env.CONTRACT_ADDRESS!;
const abi = [
    // Updated ABI to match the actual contract
    {
        "inputs": [
            {"internalType": "uint256", "name": "_amount", "type": "uint256"},
            {"internalType": "uint256", "name": "_interestRate", "type": "uint256"},
            {"internalType": "uint256", "name": "_duration", "type": "uint256"}
        ],
        "name": "createLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "name": "loanId", "type": "uint256"},
            {"indexed": false, "name": "borrower", "type": "address"},
            {"indexed": false, "name": "amount", "type": "uint256"}
        ],
        "name": "LoanCreated",
        "type": "event"
    }
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { amount, interestRate, duration } = req.body;
            
            if (!amount || !interestRate || !duration) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }

            const amountInWei = ethers.utils.parseEther(amount.toString());
            const tx = await contract.createLoan(
                amountInWei,
                ethers.BigNumber.from(interestRate),
                ethers.BigNumber.from(duration)
            );
            
            const receipt = await tx.wait();
            const event = receipt.events?.find((e: { event: string; }) => e.event === 'LoanCreated');
            
            if (!event) {
                return res.status(200).json({ 
                    message: 'Loan created but no event found',
                    tx: tx.hash
                });
            }

            res.status(200).json({ 
                message: 'Loan created',
                loanId: event.args.loanId.toString(),
                borrower: event.args.borrower,
                amount: ethers.utils.formatEther(event.args.amount),
                tx: tx.hash
            });
            
        } catch (error) {
            console.error('Error details:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                details: JSON.stringify(error, null, 2)
            });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}