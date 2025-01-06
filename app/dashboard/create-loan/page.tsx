'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
            const response = await fetch('/api/create-loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
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
                    <h1 className="text-2xl font-bold">Create New Loan</h1>
                    <p className="text-muted-foreground">Create a new loan request with property details</p>
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
                                    Amount (ETH)
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            amount: e.target.value
                                        })}
                                    />
                                </label>
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

                        {/* Add helper text */}
                        <p className="text-sm text-muted-foreground mt-2">
                            Note: Property must be verified by admin before loan creation.
                        </p>

                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                            disabled={!account}
                        >
                            Create Loan
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
