import apiClient from './client';
import { PrepareTxResponse } from './sentinelApi';

export const registryApi = {
    prepareAddVault: async (vaultAddress: string, assetType: number, externalId: number): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/registry/prepare-add-vault', { vaultAddress, assetType, externalId });
        return res.data;
    },
    prepareUpdateVault: async (vaultAddress: string, assetType: number, externalId: number, isActive: boolean): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/registry/prepare-update-vault', { vaultAddress, assetType, externalId, isActive });
        return res.data;
    },
    prepareRemoveVault: async (vaultAddress: string): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/registry/prepare-remove-vault', { vaultAddress });
        return res.data;
    },
};
