'use client';

import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { registryApi } from '@/lib/api/registryApi';
import { useTxStore } from '@/lib/store/txStore';
import { ShieldCheck } from 'lucide-react';

export default function RegistryPage() {
    const { sendTransactionAsync } = useSendTransaction();
    const { openModal, setStatus } = useTxStore();

    const [vaultAddress, setVaultAddress] = useState('');
    const [assetType, setAssetType] = useState('0');
    const [externalId, setExternalId] = useState('');

    const addVaultMutation = useMutation({
        mutationFn: async ({ vaultAddress, assetType, externalId }: { vaultAddress: string; assetType: number; externalId: number }) => {
            openModal();
            setStatus('preparing');

            const txData = await registryApi.prepareAddVault(vaultAddress, assetType, externalId);

            setStatus('signing');
            const hash = await sendTransactionAsync({
                to: txData.to,
                data: txData.data,
            });

            setStatus('success', hash);
            return hash;
        },
        onSuccess: () => {
            toast.success('Vault registered successfully!');
            setVaultAddress('');
            setExternalId('');
        },
        onError: (error: any) => {
            console.error(error);
            const isRejection = error?.message?.includes('User rejected');
            const errorMsg = isRejection ? 'User rejected the transaction.' : error?.message || 'Transaction failed.';
            setStatus('error', undefined, errorMsg);
            toast.error(errorMsg);
        }
    });

    const handleAddVault = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vaultAddress || !assetType || !externalId) return;
        addVaultMutation.mutate({ vaultAddress, assetType: Number(assetType), externalId: Number(externalId) });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <h1 className="text-3xl font-bold text-gray-900">Registry</h1>
            </div>

            <p className="text-gray-500">Add, remove, and manage approved vaults spanning different asset types in the protocol.</p>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add Approved Vault</h2>
                <form onSubmit={handleAddVault} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vault Address</label>
                        <input
                            type="text"
                            value={vaultAddress}
                            onChange={(e) => setVaultAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                            <select
                                value={assetType}
                                onChange={(e) => setAssetType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            >
                                <option value="0">ERC20</option>
                                <option value="1">ERC721</option>
                                <option value="2">ERC1155</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">External Protocol ID</label>
                            <input
                                type="number"
                                value={externalId}
                                onChange={(e) => setExternalId(e.target.value)}
                                placeholder="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                    >
                        Register Vault
                    </button>
                </form>
            </div>
        </div>
    );
}
