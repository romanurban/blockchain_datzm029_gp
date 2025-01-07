import { ethers } from 'ethers';

// Hardcoded ETH price for demo. In production, use an oracle like Chainlink
const ETH_PRICE_USD = 2000;

export function usdToEth(usdAmount: number): string {
    return (usdAmount / ETH_PRICE_USD).toString();
}

export function ethToUsd(ethAmount: string): number {
    return parseFloat(ethAmount) * ETH_PRICE_USD;
}

export function formatUsd(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

export function parseUsd(amount: string): number {
    return parseFloat(amount.replace(/[^0-9.-]+/g, ''));
}
