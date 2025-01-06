import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/dd54350be5fa455885d349597ff28d53");
const privateKey = "YnEGAgMNAkPVlZe147s6gvrohdkzBAU+uG4bA0jzBlpzsUYThnWDKQ";
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const abi = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "initialValue",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "getValue",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newValue",
            "type": "uint256"
          }
        ],
        "name": "setValue",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
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