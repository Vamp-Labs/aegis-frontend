'use client';

import { useTxStore } from '@/lib/store/txStore';
import { CheckCircle2, Loader2, XCircle, FileSignature } from 'lucide-react';

export function TransactionModal() {
    const { isModalOpen, status, txHash, errorMessage, closeModal } = useTxStore();

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100 flex flex-col items-center text-center">

                {/* Status Icon */}
                <div className="mb-4">
                    {status === 'preparing' && <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />}
                    {status === 'signing' && <FileSignature className="w-12 h-12 text-blue-500 animate-pulse" />}
                    {status === 'mining' && <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />}
                    {status === 'success' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
                    {status === 'error' && <XCircle className="w-12 h-12 text-red-500" />}
                </div>

                {/* Status Text */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {status === 'preparing' && 'Preparing Transaction...'}
                    {status === 'signing' && 'Please Sign in Wallet'}
                    {status === 'mining' && 'Transaction Processing'}
                    {status === 'success' && 'Transaction Successful!'}
                    {status === 'error' && 'Transaction Failed'}
                </h3>

                <p className="text-gray-500 text-sm mb-6">
                    {status === 'preparing' && 'Fetching calldata from Aegis backend.'}
                    {status === 'signing' && 'Approve the transaction in your wallet.'}
                    {status === 'mining' && 'Waiting for block confirmation...'}
                    {status === 'success' && 'Your transaction has been confirmed on-chain.'}
                    {status === 'error' && (errorMessage || 'An error occurred during the transaction.')}
                </p>

                {/* Transaction Hash */}
                {txHash && (
                    <div className="mb-6 w-full">
                        <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline block truncate"
                        >
                            View on Etherscan: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </a>
                    </div>
                )}

                {/* Actions */}
                {(status === 'success' || status === 'error') && (
                    <button
                        onClick={closeModal}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
