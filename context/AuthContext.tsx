"use client";

import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface AuthContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window?.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        localStorage.setItem('walletConnected', 'true');
      } catch (error) {
        console.error('User rejected the request or an error occurred:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const isWalletConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (isWalletConnected && typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          } else {
            localStorage.removeItem('walletConnected');
            setAccount(null);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          localStorage.removeItem('walletConnected');
          setAccount(null);
        }
      }
    };

    checkIfWalletIsConnected();

    // Add event listeners for account changes and disconnect
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          localStorage.removeItem('walletConnected');
        }
      });

      window.ethereum.on('disconnect', () => {
        setAccount(null);
        localStorage.removeItem('walletConnected');
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ account, connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};
