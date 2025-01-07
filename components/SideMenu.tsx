"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/context/WalletContext";
import { formatUsd } from "@/utils/currency";

// Menu item type for better organization
interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function SideMenu() {
  const { account, disconnectWallet } = useAuth();
  const { assets } = useWallet();

  // Group menu items by category
  const mainMenuItems: MenuItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "Wallet", href: "/dashboard/wallet" },
  ];

  const investmentItems: MenuItem[] = [
    { label: "Browse Properties", href: "/dashboard/loans" },
    { label: "Auto-Invest Settings", href: "/dashboard/auto-invest" },
  ];

  const propertyItems: MenuItem[] = [
    { label: "List Your Property", href: "/dashboard/create-loan" },
    { label: "My Documents", href: "/dashboard/my-documents" },
  ];

  const renderMenuGroup = (items: MenuItem[], title: string) => (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-200/50 rounded-md transition-colors"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="w-64 bg-gray-100/50 backdrop-blur-sm p-4 rounded-[0.5rem] border shadow flex flex-col h-[calc(100vh-2rem)]">
      {/* Account Summary */}
      <div className="pb-4 mb-4 border-b">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="text-xl font-bold">{formatUsd(assets.available)}</p>
        <p className="text-xs text-muted-foreground truncate">
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
        </p>
      </div>

      {/* Menu Groups */}
      <div className="flex-1 space-y-6">
        {renderMenuGroup(mainMenuItems, "Main")}
        {renderMenuGroup(investmentItems, "Investments")}
        {renderMenuGroup(propertyItems, "Property Management")}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t">
        <button 
          onClick={disconnectWallet}
          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-center"
        >
          Disconnect Wallet
        </button>
      </div>
    </nav>
  );
}