'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';

export function WalletButton() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDisconnect = () => {
        disconnect();
        logout();
    };

    if (!mounted) return <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md" />;

    if (isConnected && address) {
        const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
        return (
            <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-medium">{formattedAddress}</span>
                    <span className="text-xs text-green-600">
                        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </span>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => connect({ connector: injected() })}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
            Connect Wallet
        </button>
    );
}
