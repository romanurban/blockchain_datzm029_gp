"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { account } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push('/dashboard');
    }
  }, [account, router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-[0.5rem] border bg-background shadow flex flex-col items-center justify-center py-4 px-8">
        <h1 className="text-2xl font-bold mb-4">Crowdfunding Development Platform</h1>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
