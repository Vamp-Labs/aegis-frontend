import apiClient from './client';

export const authApi = {
    getNonce: async (address: string): Promise<{ nonce: string; messageToSign: string }> => {
        const response = await apiClient.get(`/auth/nonce`, {
            params: { publicAddress: address },
        });
        return response.data;
    },

    verifySignature: async (address: string, signature: string, message: string): Promise<{ accessToken: string }> => {
        const response = await apiClient.post(`/auth/verify`, {
            publicAddress: address,
            signature,
            message,
        });
        return response.data;
    },
};
