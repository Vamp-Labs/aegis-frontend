'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAccount, useSignMessage } from 'wagmi';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/authApi';
import { useAuthStore } from '@/lib/store/authStore';
import { WalletButton } from '@/components/shared/WalletButton';
import { Shield } from 'lucide-react';

export default function LoginPage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { login } = useAuthStore();
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: async (userAddress: string) => {
            // 1. Get nonce from backend
            const { nonce, messageToSign } = await authApi.getNonce(userAddress);

            // 2. Request signature via MetaMask
            const signature = await signMessageAsync({ message: messageToSign });

            // 3. Verify signature with backend
            const { accessToken } = await authApi.verifySignature(userAddress, signature, messageToSign);

            return accessToken;
        },
        onSuccess: (accessToken) => {
            login(accessToken);
            toast.success('Successfully authenticated');
            router.push('/dashboard');
        },
        onError: (error: any) => {
            console.error('Sign-in error:', error);
            const isRejection = error?.message?.includes('User rejected');
            toast.error(isRejection ? 'Signature request rejected.' : error?.message || 'Signature verification failed.');
        },
    });

    const handleSignIn = () => {
        if (!address) return;
        loginMutation.mutate(address);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Aegis Protocol</h1>
                <p className="text-gray-500 mb-8">
                    Connect your wallet and sign a message to securely access the Sentinel dashboard.
                </p>

                {!isConnected ? (
                    <div className="w-full flex justify-center">
                        <WalletButton />
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-4">
                        <button
                            onClick={handleSignIn}
                            disabled={loginMutation.isPending}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loginMutation.isPending ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Sign In with Ethereum'
                            )}
                        </button>

                        {loginMutation.error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 text-left">
                                {loginMutation.error.message}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
