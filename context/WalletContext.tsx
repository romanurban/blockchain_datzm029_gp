'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface WalletAssets {
    available: number;
    invested: number;
    returns: number;
    pending: number;
}

interface Transaction {
    id: number;
    type: string;
    amount: number;
    status: string;
    date: string;
    hash: string;
}

interface WalletContextType {
    assets: WalletAssets;
    transactions: Transaction[];
    addTransaction: (type: string, amount: number) => void;
    updateAssets: (changes: Partial<WalletAssets>) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [assets, setAssets] = useState<WalletAssets>({
        available: 12500,
        invested: 45000,
        returns: 3750,
        pending: 1500
    });

    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: 1, type: 'Deposit', amount: 5000, status: 'completed', date: '2024-01-15', hash: '0x1234...5678' },
        { id: 2, type: 'Investment', amount: -2500, status: 'completed', date: '2024-01-14', hash: '0x8765...4321' },
        { id: 3, type: 'Return', amount: 375, status: 'completed', date: '2024-01-13', hash: '0x9876...1234' },
        { id: 4, type: 'Withdrawal', amount: -1000, status: 'pending', date: '2024-01-12', hash: '0x4567...8901' },
    ]);

    const addTransaction = (type: string, amount: number) => {
        const newTransaction = {
            id: Date.now(),
            type,
            amount,
            status: 'completed',
            date: new Date().toISOString().split('T')[0],
            hash: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10)
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const updateAssets = (changes: Partial<WalletAssets>) => {
        setAssets(prev => ({ ...prev, ...changes }));
    };

    return (
        <WalletContext.Provider value={{ assets, transactions, addTransaction, updateAssets }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error('useWallet must be used within WalletProvider');
    return context;
};
