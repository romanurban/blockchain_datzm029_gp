'use client';

import { useWallet } from '@/context/WalletContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatUsd } from '@/utils/currency';

export default function DashboardPage() {
    const { assets, transactions } = useWallet();

    // Calculate some derived statistics
    const totalBalance = assets.available + assets.invested;
    const totalReturns = assets.returns + assets.pending;
    const portfolioHealth = ((assets.returns / assets.invested) * 100).toFixed(1);
    
    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Main Stats Grid */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                        <h2 className="text-2xl font-bold">{formatUsd(totalBalance)}</h2>
                        <p className="text-sm text-green-600">+{portfolioHealth}% all time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Active Investments</p>
                        <h2 className="text-2xl font-bold">{formatUsd(assets.invested)}</h2>
                        <p className="text-sm text-muted-foreground">{Math.floor(assets.invested/2500)} active loans</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Returns</p>
                        <h2 className="text-2xl font-bold text-green-600">{formatUsd(totalReturns)}</h2>
                        <p className="text-sm text-muted-foreground">From all investments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Available to Invest</p>
                        <h2 className="text-2xl font-bold">{formatUsd(assets.available)}</h2>
                        <p className="text-sm text-muted-foreground">Ready to deploy</p>
                    </CardContent>
                </Card>
            </div>

            {/* Investment Overview */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Recent Activity</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {transactions.slice(0, 5).map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                                    <div className="space-y-1">
                                        <p className="font-medium">{tx.type}</p>
                                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : ''}`}>
                                            {tx.amount > 0 ? '+' : ''}{formatUsd(tx.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Investment Summary */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Portfolio Metrics</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Portfolio Health</span>
                                <span className="text-green-600 font-medium">Excellent</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Average Interest Rate</span>
                                <span className="font-medium">8.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Risk Level</span>
                                <span className="text-yellow-600 font-medium">Moderate</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Diversification Score</span>
                                <span className="font-medium">7.5/10</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Auto-Invest Status</span>
                                <span className="text-green-600 font-medium">Active</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Investment Opportunities */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Market Overview</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Available Opportunities</h3>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">Active loan requests</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Market Sentiment</h3>
                        <p className="text-2xl font-bold text-green-600">Bullish</p>
                        <p className="text-sm text-muted-foreground">Based on recent activity</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Recommended Action</h3>
                        <p className="text-2xl font-bold text-blue-600">Invest</p>
                        <p className="text-sm text-muted-foreground">Market conditions favorable</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}