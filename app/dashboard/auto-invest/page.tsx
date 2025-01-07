'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { formatUsd } from '@/utils/currency';

interface AutoInvestStrategy {
    enabled: boolean;
    monthlyBudget: number;
    minInterestRate: number;
    maxLoanAmount: number;
    diversificationCount: number;
    autoReinvest: boolean;
    riskFactors: {
        ltv: number;           // Loan-to-Value ratio
        creditScore: number;   // Property owner's credit score threshold
        occupancyRate: number; // For commercial properties
        propertyCondition: string[]; // A,B,C grade properties
    };
}

export default function AutoInvestPage() {
    const [strategy, setStrategy] = useState<AutoInvestStrategy>({
        enabled: false,
        monthlyBudget: 1000,
        minInterestRate: 5,
        maxLoanAmount: 50000,
        diversificationCount: 5,
        autoReinvest: true,
        riskFactors: {
            ltv: 75,
            creditScore: 680,
            occupancyRate: 90,
            propertyCondition: ['A']
        }
    });

    const handleStrategyChange = (key: keyof AutoInvestStrategy, value: number | boolean | string[] | object) => {
        setStrategy(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveStrategy = async () => {
        // TODO: Implement strategy saving to backend
        console.log('Saving strategy:', strategy);
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Invested</p>
                            <p className="text-2xl font-bold">{formatUsd(125000)}</p>
                            <p className="text-sm text-green-600">+12.5%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Active Investments</p>
                            <p className="text-2xl font-bold">28</p>
                            <p className="text-sm text-green-600">+3</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Average ROI</p>
                            <p className="text-2xl font-bold">8.5%</p>
                            <p className="text-sm text-green-600">+0.5%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Auto-Invested This Month</p>
                            <p className="text-2xl font-bold">{formatUsd(15000)}</p>
                            <p className="text-sm text-red-600">-2.3%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Auto-Invest Configuration</h1>
                            <p className="text-muted-foreground">Configure your automated investment strategy</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={strategy.enabled ? "text-green-600" : "text-muted-foreground"}>
                                {strategy.enabled ? "Active" : "Inactive"}
                            </span>
                            <Switch
                                checked={strategy.enabled}
                                onCheckedChange={(checked) => handleStrategyChange('enabled', checked)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Monthly Budget */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Monthly Investment Budget
                            <span className="ml-2 text-muted-foreground">
                                {formatUsd(strategy.monthlyBudget)}
                            </span>
                        </label>
                        <Slider
                            value={[strategy.monthlyBudget]}
                            onValueChange={([value]) => handleStrategyChange('monthlyBudget', value)}
                            min={100}
                            max={10000}
                            step={100}
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum amount to invest per month
                        </p>
                    </div>

                    {/* Interest Rate Threshold */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Minimum Interest Rate
                            <span className="ml-2 text-muted-foreground">
                                {strategy.minInterestRate}%
                            </span>
                        </label>
                        <Slider
                            value={[strategy.minInterestRate]}
                            onValueChange={([value]) => handleStrategyChange('minInterestRate', value)}
                            min={1}
                            max={20}
                            step={0.5}
                        />
                    </div>

                    {/* Maximum Loan Amount */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Maximum Loan Amount
                            <span className="ml-2 text-muted-foreground">
                                {formatUsd(strategy.maxLoanAmount)}
                            </span>
                        </label>
                        <Slider
                            value={[strategy.maxLoanAmount]}
                            onValueChange={([value]) => handleStrategyChange('maxLoanAmount', value)}
                            min={1000}
                            max={100000}
                            step={1000}
                        />
                    </div>

                    {/* Replace Property Types with Risk Factors */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Risk Assessment Criteria</h3>
                        
                        {/* LTV Ratio */}
                        <div className="space-y-2">
                            <label className="text-sm">
                                Maximum Loan-to-Value Ratio
                                <span className="ml-2 text-muted-foreground">{strategy.riskFactors.ltv}%</span>
                            </label>
                            <Slider
                                value={[strategy.riskFactors.ltv]}
                                onValueChange={([value]) => handleStrategyChange('riskFactors', {
                                    ...strategy.riskFactors,
                                    ltv: value
                                })}
                                min={50}
                                max={90}
                                step={5}
                            />
                        </div>

                        {/* Credit Score */}
                        <div className="space-y-2">
                            <label className="text-sm">
                                Minimum Credit Score
                                <span className="ml-2 text-muted-foreground">{strategy.riskFactors.creditScore}</span>
                            </label>
                            <Slider
                                value={[strategy.riskFactors.creditScore]}
                                onValueChange={([value]) => handleStrategyChange('riskFactors', {
                                    ...strategy.riskFactors,
                                    creditScore: value
                                })}
                                min={600}
                                max={800}
                                step={20}
                            />
                        </div>

                        {/* Property Grade */}
                        <div className="space-y-2">
                            <label className="text-sm">Property Grade</label>
                            <div className="flex gap-2">
                                {['A', 'B', 'C'].map((grade) => (
                                    <button
                                        key={grade}
                                        type="button"
                                        onClick={() => {
                                            const grades = strategy.riskFactors.propertyCondition.includes(grade)
                                                ? strategy.riskFactors.propertyCondition.filter(g => g !== grade)
                                                : [...strategy.riskFactors.propertyCondition, grade];
                                            handleStrategyChange('riskFactors', {
                                                ...strategy.riskFactors,
                                                propertyCondition: grades
                                            });
                                        }}
                                        className={`px-4 py-2 rounded-md border ${
                                            strategy.riskFactors.propertyCondition.includes(grade)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-background hover:bg-secondary'
                                        }`}
                                    >
                                        Grade {grade}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                A: Excellent condition | B: Good condition | C: Needs improvement
                            </p>
                        </div>
                    </div>

                    {/* Diversification */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Maximum investments per Property
                            <span className="ml-2 text-muted-foreground">
                                {strategy.diversificationCount} investments
                            </span>
                        </label>
                        <Slider
                            value={[strategy.diversificationCount]}
                            onValueChange={([value]) => handleStrategyChange('diversificationCount', value)}
                            min={1}
                            max={10}
                            step={1}
                        />
                    </div>

                    {/* Auto Reinvest */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">Auto-Reinvest Returns</label>
                            <p className="text-xs text-muted-foreground">
                                Automatically reinvest received loan repayments
                            </p>
                        </div>
                        <Switch
                            checked={strategy.autoReinvest}
                            onCheckedChange={(checked) => handleStrategyChange('autoReinvest', checked)}
                        />
                    </div>

                    <button
                        onClick={handleSaveStrategy}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                    >
                        Save Strategy
                    </button>
                </CardContent>
            </Card>

            {/* Additional market insights card */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Market Insights</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-sm font-medium">Trending Interest Rates</h3>
                        <p className="text-2xl font-bold">7.2%</p>
                        <p className="text-xs text-muted-foreground">Average this month</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Available Loans</h3>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-xs text-muted-foreground">Ready for investment</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Market Activity</h3>
                        <p className="text-2xl font-bold text-green-600">High</p>
                        <p className="text-xs text-muted-foreground">Based on recent transactions</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}