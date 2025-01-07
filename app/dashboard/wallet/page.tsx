'use client';

import { useContext } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatUsd } from '@/utils/currency';
import { AuthContext } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';

export default function WalletPage() {
    const { account } = useContext(AuthContext);
    const { assets, transactions } = useWallet();

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

            {/* Asset Distribution and Quick Actions Grid */}
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