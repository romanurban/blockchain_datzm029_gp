'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ethToUsd, formatUsd, usdToEth } from '@/utils/currency';

interface Loan {
    id: string;
    borrower: string;
    amount: string;
    fundedAmount: string;
    interestRate: string;
    duration: string;
    isActive: boolean;
    propertyHash: string;
    propertyAddress: string;
    isVerified: boolean;
}

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [investAmount, setInvestAmount] = useState<{[key: string]: string}>({});
    const [investStatus, setInvestStatus] = useState<{[key: string]: string}>({});

    // Define fetchLoans as useCallback to prevent unnecessary recreations
    const fetchLoans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/get-loans');
            if (!response.ok) throw new Error('Failed to fetch loans');
            const data = await response.json();
            setLoans(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch loans');
        } finally {
            setLoading(false);
        }
    }, []);

    // Use fetchLoans in useEffect
    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const handleInvest = async (loanId: string) => {
        try {
            const usdAmount = investAmount[loanId];
            if (!usdAmount) {
                setInvestStatus({...investStatus, [loanId]: 'Please enter an amount'});
                return;
            }

            // Convert USD to ETH for contract interaction
            const ethAmount = usdToEth(parseFloat(usdAmount));

            const response = await fetch('/api/invest-in-loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loanId, amount: ethAmount })
            });

            const data = await response.json();

            if (response.ok) {
                setInvestStatus({...investStatus, [loanId]: `Investment successful! Tx: ${data.tx}`});
                // Refresh loans list
                fetchLoans();
            } else {
                setInvestStatus({...investStatus, [loanId]: data.error || 'Investment failed'});
            }
        } catch (error) {
            setInvestStatus({
                ...investStatus, 
                [loanId]: error instanceof Error ? error.message : 'Investment failed'
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-destructive">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Available Loan Opportunities</h1>
                    <p className="text-muted-foreground">Invest in available loan opportunities</p>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {loans.map((loan) => (
                            <div key={loan.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">Property: {loan.propertyAddress}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Amount: {formatUsd(ethToUsd(loan.amount))}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Interest Rate: {loan.interestRate}%
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Duration: {loan.duration} months
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Loan #{loan.id}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            loan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {loan.isActive ? 'Active' : 'Funded'}
                                        </span>
                                        <p className="text-sm mt-2">
                                            Progress: {formatUsd(ethToUsd(loan.fundedAmount))} / {formatUsd(ethToUsd(loan.amount))}
                                        </p>
                                    </div>
                                </div>
                                {loan.isActive && (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Amount to invest (USD)"
                                            className="flex h-10 rounded-md border border-input px-3 py-2 text-sm"
                                            value={investAmount[loan.id] || ''}
                                            onChange={(e) => setInvestAmount({
                                                ...investAmount,
                                                [loan.id]: e.target.value
                                            })}
                                        />
                                        <button
                                            onClick={() => handleInvest(loan.id)}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                                        >
                                            Invest
                                        </button>
                                        {investStatus[loan.id] && (
                                            <p className={`text-sm ${
                                                investStatus[loan.id].includes('successful') 
                                                    ? 'text-green-600' 
                                                    : 'text-destructive'
                                            }`}>
                                                {investStatus[loan.id]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
