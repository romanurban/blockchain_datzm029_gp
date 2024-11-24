"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const ConnectWalletButton: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useAuth();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleClick = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-primary text-white rounded"
    >
      {account && typeof account === 'string' 
        ? `Connected: ${formatAddress(account)}` 
        : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWalletButton;
