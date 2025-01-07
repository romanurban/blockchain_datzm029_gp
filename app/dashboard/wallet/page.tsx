'use client';

import { useState, useContext } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatUsd } from '@/utils/currency';
import { AuthContext } from '@/context/AuthContext';

interface Assets {
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

export default function WalletPage() {
    const { account } = useContext(AuthContext);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [investAmount, setInvestAmount] = useState('');
    const [assets, setAssets] = useState<Assets>({
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

    const handleSimulateInvestment = () => {
        const amount = parseFloat(investAmount);
        if (isNaN(amount) || amount <= 0 || amount > assets.available) return;

        // Update assets
        setAssets(prev => ({
            ...prev,
            available: prev.available - amount,
            invested: prev.invested + amount,
            pending: prev.pending + (amount * 0.08) // Simulate 8% annual return
        }));

        // Add new transaction
        const newTransaction = {
            id: Date.now(),
            type: 'Investment',
            amount: -amount,
            status: 'completed',
            date: new Date().toISOString().split('T')[0],
            hash: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10)
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setShowInvestModal(false);
        setInvestAmount('');
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Main Balance Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-sm text-muted-foreground">Total Balance</p>
                        <h1 className="text-4xl font-bold">{formatUsd(assets.available + assets.invested)}</h1>
                        <p className="text-sm">Wallet Address: {account || '0x0000...0000'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Change Quick Invest Button */}
            <button
                onClick={() => setShowInvestModal(true)}
                className="w-full bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 rounded-md font-medium"
            >
                Invest Now
            </button>

            {/* Investment Modal */}
            {showInvestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">New Investment</h2>
                            <p className="text-sm text-muted-foreground">Available balance: {formatUsd(assets.available)}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Investment Amount
                                    <div className="relative mt-1.5">
                                        <span className="absolute left-3 top-2.5">$</span>
                                        <input
                                            type="number"
                                            className="flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2"
                                            value={investAmount}
                                            onChange={(e) => setInvestAmount(e.target.value)}
                                            max={assets.available}
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Min: $100 | Max: {formatUsd(assets.available)}
                                    </p>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSimulateInvestment}
                                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium"
                                >
                                    Confirm Investment
                                </button>
                                <button
                                    onClick={() => setShowInvestModal(false)}
                                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Asset Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Asset Distribution</h2>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {Object.entries(assets).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </p>
                                <p className={`text-2xl font-bold ${
                                    key === 'returns' ? 'text-green-600' : 
                                    key === 'pending' ? 'text-yellow-600' : ''
                                }`}>
                                    {formatUsd(value)}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Quick Actions</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <button 
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                            onClick={() => alert('Deposit functionality coming soon!')}
                        >
                            Deposit Funds
                        </button>
                        <button 
                            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2 rounded-md"
                            onClick={() => alert('Withdraw functionality coming soon!')}
                        >
                            Withdraw Funds
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium">{tx.type}</p>
                                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : ''}`}>
                                        {tx.amount > 0 ? '+' : ''}{formatUsd(tx.amount)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{tx.hash}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}