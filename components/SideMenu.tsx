// components/SideMenu.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function SideMenu() {
  const { account, disconnectWallet } = useAuth();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="w-64 bg-gray-100 p-4 rounded-[0.5rem] border shadow flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center">Menu</h2>
      <ul className="space-y-2">
        <li className="text-center">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
        </li>
        <li className="text-center">
          <Link href="/dashboard/auto-invest" className="text-gray-700 hover:text-gray-900">
            Auto-invest
          </Link>
        </li>
        <li className="text-center">
          <Link href="/dashboard/my-documents" className="text-gray-700 hover:text-gray-900">
            My Documents
          </Link>
        </li>
        <li className="text-center">
          <Link href="/dashboard/wallet" className="text-gray-700 hover:text-gray-900">
            Wallet
          </Link>
        </li>
        <li className="text-center">
          <Link href="/dashboard/loans" className="text-gray-700 hover:text-gray-900">
            Available Loans
          </Link>
        </li>
        <li className="text-center">
          <Link href="/dashboard/create-loan" className="text-gray-700 hover:text-gray-900">
            Place New Loan
          </Link>
        </li>
      </ul>
      
      <div className="flex-1"></div>
      
      <button 
        onClick={disconnectWallet}
        className="border-t text-center text-sm text-gray-500 hover:text-gray-700 transition-colors pt-4"
      >
        Wallet: {account && formatAddress(account)}
      </button>
    </nav>
  );
}