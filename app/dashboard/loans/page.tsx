'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ethToUsd, formatUsd, usdToEth } from '@/utils/currency';
import { useWallet } from '@/context/WalletContext';
import Image from 'next/image';
import { PropertyType, getPropertyImagesById, getPropertyThumbnailById } from '@/utils/images';

// Update PropertyDetails interface
interface PropertyDetails {
    type: PropertyType;
    size: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt: number;
    location: string;
    description: string;
    amenities: string[];
    images: string[];
    documents: {
        title: string;
        verified: boolean;
    }[];
}

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
    propertyDetails: PropertyDetails;
}

// Add interface for API loan data
interface ApiLoan {
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

// Add a fallback image
const DEFAULT_IMAGE = '/images/apartment001/image.jpg';

// Add mock data constant
const MOCK_LOANS: ApiLoan[] = [
    {
        id: '1',
        borrower: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '500000000000000000000', // 500 ETH (~$750,000)
        fundedAmount: '300000000000000000000', // 300 ETH
        interestRate: '7.5',
        duration: '24',
        isActive: true,
        propertyHash: '0xabc...def',
        propertyAddress: 'Modern Apartment in Manhattan, NY',
        isVerified: true,
    },
    {
        id: '2',
        borrower: '0x934d35Cc6634C0532925a3b844Bc454e4438f555',
        amount: '1000000000000000000000', // 1000 ETH (~$1.5M)
        fundedAmount: '400000000000000000000', // 400 ETH
        interestRate: '8.2',
        duration: '36',
        isActive: true,
        propertyHash: '0xdef...123',
        propertyAddress: 'Luxury Villa in Miami Beach, FL',
        isVerified: true,
    },
    {
        id: '3',
        borrower: '0x156d35Cc6634C0532925a3b844Bc454e4438f777',
        amount: '600000000000000000000', // 600 ETH (~$900,000)
        fundedAmount: '450000000000000000000', // 450 ETH
        interestRate: '7.8',
        duration: '30',
        isActive: true,
        propertyHash: '0xghi...456',
        propertyAddress: 'Commercial Office Space in Downtown, LA',
        isVerified: true,
    }
];

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [investAmount, setInvestAmount] = useState<{[key: string]: string}>({});
    const [investStatus, setInvestStatus] = useState<{[key: string]: string}>({});
    const { assets, updateAssets, addTransaction } = useWallet();
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    const fetchLoans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/get-loans');
            
            if (!response.ok) {
                throw new Error('Failed to fetch loans');
            }
            
            const apiData = await response.json();
            
            // If API returns empty array or no data, use mock data
            const loansData: ApiLoan[] = apiData.length > 0 ? apiData : MOCK_LOANS;
            
            const loansWithDetails = loansData.map((loan) => ({
                ...loan,
                propertyDetails: {
                    type: determinePropertyType(loan.propertyAddress),
                    size: 0,
                    bedrooms: 0,
                    bathrooms: 0,
                    yearBuilt: 0,
                    location: loan.propertyAddress,
                    description: '',
                    amenities: [],
                    images: [DEFAULT_IMAGE],
                    documents: []
                }
            }));
            
            setLoans(loansWithDetails);
            setError(null);
        } catch (err) {
            console.warn('Using mock data due to API error:', err);
            // Use mock data on error
            const loansWithDetails = MOCK_LOANS.map(loan => ({
                ...loan,
                propertyDetails: {
                    type: determinePropertyType(loan.propertyAddress),
                    size: 0,
                    bedrooms: 0,
                    bathrooms: 0,
                    yearBuilt: 0,
                    location: loan.propertyAddress,
                    description: '',
                    amenities: [],
                    images: [DEFAULT_IMAGE],
                    documents: []
                }
            }));
            setLoans(loansWithDetails);
            setError('Using demo data - API unavailable');
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper function to determine property type from address or other data
    const determinePropertyType = (address: string): PropertyType => {
        // Simple logic to assign type - can be enhanced based on actual data
        if (address.toLowerCase().includes('apartment')) return 'apartment';
        if (address.toLowerCase().includes('office')) return 'office';
        return 'house'; // default type
    };

    // When selecting a loan, enhance it with full property details

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

                // Update wallet assets
                updateAssets({
                    available: assets.available - parseFloat(usdAmount),
                    invested: assets.invested + parseFloat(usdAmount),
                    pending: assets.pending + (parseFloat(usdAmount) * 0.08) // 8% expected return
                });

                // Add transaction
                addTransaction('Investment', -parseFloat(usdAmount));
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

    // Mock data for property details
    const getMockPropertyDetails = (type: PropertyType = 'apartment', id: string): PropertyDetails => ({
        type,
        size: 1200,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2019,
        location: '123 Crypto Street, Blockchain City',
        description: 'Modern property in prime location with recent renovations and high rental demand.',
        amenities: ['Parking', 'Security', 'Elevator'],
        images: getPropertyImagesById(type, id),
        documents: [
            { title: 'Property Deed', verified: true },
            { title: 'Inspection Report', verified: true },
            { title: 'Appraisal Report', verified: true },
            { title: 'Insurance', verified: false }
        ]
    });

    // Add detail modal component
    const PropertyDetailModal = ({ loan }: { loan: Loan }) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold">{loan.propertyAddress}</h2>
                        <button 
                            onClick={() => setSelectedLoan(null)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Image gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(loan.propertyDetails.images.length > 0 ? loan.propertyDetails.images : [DEFAULT_IMAGE]).map((image, index) => (
                            <div key={image} className={`relative h-48 rounded-lg overflow-hidden ${
                                index === 0 ? 'md:col-span-3 h-64' : ''
                            }`}>
                                <Image
                                    src={image}
                                    alt={`Property view ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Property details grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Property Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium capitalize">{loan.propertyDetails.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Size</p>
                                    <p className="font-medium">{loan.propertyDetails.size} sq ft</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                                    <p className="font-medium">{loan.propertyDetails.bedrooms}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                                    <p className="font-medium">{loan.propertyDetails.bathrooms}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Loan Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="font-medium">{formatUsd(ethToUsd(loan.amount))}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                                    <p className="font-medium">{loan.interestRate}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-medium">{loan.duration} months</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Progress</p>
                                    <p className="font-medium">{(Number(loan.fundedAmount) / Number(loan.amount) * 100).toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{loan.propertyDetails.description}</p>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {loan.propertyDetails.amenities.map((amenity) => (
                                <span key={amenity} className="px-3 py-1 bg-secondary rounded-full text-sm">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Investment section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Make an Investment</h3>
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
                </div>
            </div>
        </div>
    );

    if (loading) return <div>Loading...</div>;

    // Update error display to be less prominent for mock data
    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-4">
                    {error}
                </div>
                {/* Continue rendering the page with mock data */}
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold">Available Loan Opportunities</h1>
                        <p className="text-muted-foreground">Invest in available loan opportunities</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {loans.map((loan) => (
                                <div 
                                    key={loan.id} 
                                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedLoan({ 
                                        ...loan, 
                                        propertyDetails: getMockPropertyDetails(loan.propertyDetails.type, loan.id) 
                                    })}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative w-24 h-24 rounded-md overflow-hidden">
                                            <Image
                                                src={getPropertyThumbnailById(loan.propertyDetails.type, loan.id) || DEFAULT_IMAGE}
                                                alt="Property thumbnail"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
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
                                        <div className="flex flex-col gap-2 mt-4" onClick={e => e.stopPropagation()}>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInvest(loan.id);
                                                }}
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
                
                {selectedLoan && <PropertyDetailModal loan={selectedLoan} />}
            </div>
        );
    }

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
                            <div 
                                key={loan.id} 
                                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedLoan({ 
                                    ...loan, 
                                    propertyDetails: getMockPropertyDetails(loan.propertyDetails.type, loan.id) 
                                })}
                            >
                                <div className="flex gap-4">
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                                        <Image
                                            src={getPropertyThumbnailById(loan.propertyDetails.type, loan.id) || DEFAULT_IMAGE}
                                            alt="Property thumbnail"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
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
                                    <div className="flex flex-col gap-2 mt-4" onClick={e => e.stopPropagation()}>
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInvest(loan.id);
                                            }}
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
            
            {selectedLoan && <PropertyDetailModal loan={selectedLoan} />}
        </div>
    );
}
