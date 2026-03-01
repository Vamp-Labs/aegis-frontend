import apiClient from './client';

export interface PrepareTxResponse {
    to: `0x${string}`;
    data: `0x${string}`;
    chainId: number;
}

export const sentinelApi = {
    prepareRegisterPosition: async (vault: string, triggerRiskThreshold: number): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/sentinel/prepare-register', { vault, triggerRiskThreshold });
        return res.data;
    },
    prepareUpdateRiskConfig: async (positionId: string, triggerRiskThreshold: number): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/sentinel/prepare-update-risk', { positionId, triggerRiskThreshold });
        return res.data;
    },
    prepareRemovePosition: async (positionId: string): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/sentinel/prepare-remove', { positionId });
        return res.data;
    },
};
