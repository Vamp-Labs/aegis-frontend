'use client';

import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sentinelApi } from '@/lib/api/sentinelApi';
import { useTxStore } from '@/lib/store/txStore';
import { Shield } from 'lucide-react';

export default function SentinelPage() {
    const { sendTransactionAsync } = useSendTransaction();
    const { openModal, setStatus, closeModal } = useTxStore();

    const [vaultAddress, setVaultAddress] = useState('');
    const [threshold, setThreshold] = useState('');

    const registerMutation = useMutation({
        mutationFn: async ({ vault, triggerRiskThreshold }: { vault: string; triggerRiskThreshold: number }) => {
            openModal();
            setStatus('preparing');

            const txData = await sentinelApi.prepareRegisterPosition(vault, triggerRiskThreshold);

            setStatus('signing');
            const hash = await sendTransactionAsync({
                to: txData.to,
                data: txData.data,
            });

            setStatus('success', hash);
            return hash;
        },
        onSuccess: (hash) => {
            toast.success('Position registered successfully!');
            setVaultAddress('');
            setThreshold('');
        },
        onError: (error: any) => {
            console.error(error);
            const isRejection = error?.message?.includes('User rejected');
            const errorMsg = isRejection ? 'User rejected the transaction.' : error?.message || 'Transaction failed.';
            setStatus('error', undefined, errorMsg);
            toast.error(errorMsg);
        }
    });

    const handleRegisterPosition = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vaultAddress || !threshold) return;
        registerMutation.mutate({ vault: vaultAddress, triggerRiskThreshold: Number(threshold) });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Sentinel Controls</h1>
            </div>

            <p className="text-gray-500">Manage protected positions and configure protocol level risk thresholds.</p>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Register New Position</h2>
                <form onSubmit={handleRegisterPosition} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vault Address</label>
                        <input
                            type="text"
                            value={vaultAddress}
                            onChange={(e) => setVaultAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Risk Threshold (0-100)</label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                            min="0"
                            max="100"
                            placeholder="85"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Register Position
                    </button>
                </form>
            </div>
        </div>
    );
}
