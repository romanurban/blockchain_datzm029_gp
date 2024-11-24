import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';

const provider = new JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const privateKey = "YOUR_PRIVATE_KEY";
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const abi: never[] = [
    // ABI of your contract
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { amount, interestRate, duration } = req.body;
        try {
            const tx = await contract.createLoan(amount, interestRate, duration);
            await tx.wait();
            res.status(200).json({ message: 'Loan created', tx });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}