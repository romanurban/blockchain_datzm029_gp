'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usdToEth } from '@/utils/currency';

export default function CreateLoanPage() {
    const { account } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        amount: '',
        interestRate: '',
        duration: '',
        propertyAddress: '' // Add this field
    });
    const [status, setStatus] = useState<{
        message: string;
        isError: boolean;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert USD to ETH for the contract
            const ethAmount = usdToEth(parseFloat(formData.amount));
            
            const response = await fetch('/api/create-loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: ethAmount,
                    interestRate: parseFloat(formData.interestRate),
                    duration: parseInt(formData.duration),
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ 
                    message: `Loan created successfully! Transaction hash: ${data.tx}`, 
                    isError: false 
                });
                setFormData({ amount: '', interestRate: '', duration: '', propertyAddress: '' });
            } else {
                setStatus({ 
                    message: data.error || 'Failed to create loan', 
                    isError: true 
                });
            }
        } catch (error) {
            setStatus({ 
                message: error instanceof Error ? error.message : 'Error creating loan', 
                isError: true 
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Create New Loan Opportunity</h1>
                    <p className="text-muted-foreground">Create a new loan request in USD</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid w-full items-center gap-4">
                            {/* Add property address input first */}
                            <div className="flex flex-col space-y-1.5">
                                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Property Address
                                    <input
                                        type="text"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.propertyAddress}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            propertyAddress: e.target.value
                                        })}
                                        placeholder="Enter full property address"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Amount (USD)
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                amount: e.target.value
                                            })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </label>
                                {formData.amount && (
                                    <p className="text-xs text-muted-foreground">
                                        ≈ {parseFloat(usdToEth(parseFloat(formData.amount))).toFixed(6)} ETH
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Interest Rate (%)
                                    <input
                                        type="number"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.interestRate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            interestRate: e.target.value
                                        })}
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Duration (months)
                                    <input
                                        type="number"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            duration: e.target.value
                                        })}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Add document upload section before the helper text */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Property Documents</p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => alert('Document upload functionality coming soon!')}
                                    className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    Upload Documents
                                </button>
                                <span className="text-sm text-muted-foreground">No files selected</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upload property documentation (deed, appraisal, inspection reports)
                            </p>
                        </div>

                        {/* Add helper text */}
                        <p className="text-sm text-muted-foreground mt-2">
                            Note: Property must be verified by admin before loan creation.
                        </p>

                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                            disabled={!account}
                        >
                            Create Loan Request
                        </button>
                    </form>
                    {status && (
                        <div className={`mt-4 p-4 rounded-md ${
                            status.isError ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                        }`}>
                            {status.message}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
