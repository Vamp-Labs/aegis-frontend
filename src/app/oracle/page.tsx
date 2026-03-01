'use client';

import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { oracleApi } from '@/lib/api/oracleApi';
import { useTxStore } from '@/lib/store/txStore';
import { Activity } from 'lucide-react';

export default function OraclePage() {
    const { sendTransactionAsync } = useSendTransaction();
    const { openModal, setStatus } = useTxStore();

    const [protocolId, setProtocolId] = useState('');
    const [riskScore, setRiskScore] = useState('');

    const submitSignalMutation = useMutation({
        mutationFn: async ({ protocolId, riskScore }: { protocolId: string; riskScore: number }) => {
            openModal();
            setStatus('preparing');

            const txData = await oracleApi.prepareSubmitSignal(protocolId, riskScore);

            setStatus('signing');
            const hash = await sendTransactionAsync({
                to: txData.to,
                data: txData.data,
            });

            setStatus('success', hash);
            return hash;
        },
        onSuccess: () => {
            toast.success('Risk signal submitted successfully!');
            setProtocolId('');
            setRiskScore('');
        },
        onError: (error: any) => {
            console.error(error);
            const isRejection = error?.message?.includes('User rejected');
            const errorMsg = isRejection ? 'User rejected the transaction.' : error?.message || 'Transaction failed.';
            setStatus('error', undefined, errorMsg);
            toast.error(errorMsg);
        }
    });

    const handleSubmitSignal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!protocolId || !riskScore) return;
        submitSignalMutation.mutate({ protocolId, riskScore: Number(riskScore) });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">Risk Oracle</h1>
            </div>

            <p className="text-gray-500">Provide on-chain risk signals for protocols. Only approved oracles can submit signals.</p>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Risk Signal</h2>
                <form onSubmit={handleSubmitSignal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Protocol ID (bytes32 hex)</label>
                        <input
                            type="text"
                            value={protocolId}
                            onChange={(e) => setProtocolId(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Risk Score (0=Safe, 1=Warning, 2=Critical)</label>
                        <select
                            value={riskScore}
                            onChange={(e) => setRiskScore(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            required
                        >
                            <option value="">Select a score...</option>
                            <option value="0">0 - Safe</option>
                            <option value="1">1 - Warning</option>
                            <option value="2">2 - Critical</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        Submit Signal
                    </button>
                </form>
            </div>
        </div>
    );
}
