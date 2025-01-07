# Blockchain Project

This is a Web3 development project that combines Next.js for the frontend and Hardhat for smart contract development and testing. The project implements a decentralized crowdfunding platform where users can create and participate in fundraising campaigns using cryptocurrency.

## Project Overview

This project implements:
- Smart contract development with Solidity
- Web3 integration using ethers.js
- Modern UI with Next.js 13+ and TypeScript
- Local blockchain development with Hardhat

### Crowdfunding Features

The platform enables users to:
- Create new fundraising campaigns with specific goals and deadlines
- Contribute ETH to existing campaigns
- Track campaign progress and funding status in real-time
- Withdraw funds when campaign goals are met
- Refund contributors if campaign goals are not met by deadline

Key Smart Contract Functions:
- `createCampaign`: Start a new fundraising campaign
- `contributeToCampaign`: Send ETH to support a campaign
- `withdrawFunds`: Campaign creators can withdraw funds after successful completion
- `requestRefund`: Contributors can get refunds for failed campaigns
- `getCampaignDetails`: View detailed information about any campaign
- `getAllCampaigns`: List all active and past campaigns

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blockchain Development

### Setting up Local Hardhat Node

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Start the local Hardhat network:
```bash
npx hardhat node
```

This will start a local blockchain network with pre-funded accounts for development.

### Deploying Smart Contracts

1. Compile the contracts:
```bash
npx hardhat compile
```

2. Deploy to local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Testing

Run the test suite:
```bash
npx hardhat test
```

## Development Workflow

1. Start the local Hardhat node
2. Deploy your smart contracts
3. Start the Next.js development server
4. Connect MetaMask to localhost:8545 (Hardhat Network)

### MetaMask Configuration
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
