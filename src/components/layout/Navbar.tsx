'use client';

import { usePathname } from 'next/navigation';
import { WalletButton } from '../shared/WalletButton';

export function Navbar() {
    const pathname = usePathname();

    if (pathname === '/' || pathname === '/login') return null;

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 w-full">
            <div className="flex items-center gap-4 text-gray-800 md:hidden">
                <span className="font-bold">Aegis</span>
            </div>
            {/* Spacer for desktop since title is in sidebar */}
            <div className="hidden md:block flex-1" />

            <div className="flex items-center gap-4">
                {/* Network Indicator connected to wagmi testnet could go here */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Sepolia
                </div>
                <WalletButton />
            </div>
        </header>
    );
}
