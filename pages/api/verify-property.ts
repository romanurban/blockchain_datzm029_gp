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
        const { propertyAddress } = req.body;
        
        if (!propertyAddress) {
            return res.status(400).json({ error: 'Property address required' });
        }

        const propertyHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(propertyAddress)
        );

        const tx = await contract.verifyProperty(propertyHash);
        await tx.wait();

        res.status(200).json({
            message: 'Property verified',
            propertyAddress,
            propertyHash
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            error: 'Failed to verify property',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
