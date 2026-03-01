import apiClient from './client';
import { PrepareTxResponse } from './sentinelApi';

export const oracleApi = {
    prepareSubmitSignal: async (protocolId: string, riskScore: number): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/oracle/prepare-submit-signal', { protocolId, riskScore });
        return res.data;
    },
    prepareAddOracle: async (oracleAddress: string): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/oracle/prepare-add-oracle', { oracleAddress });
        return res.data;
    },
    prepareRemoveOracle: async (oracleAddress: string): Promise<PrepareTxResponse> => {
        const res = await apiClient.post('/oracle/prepare-remove-oracle', { oracleAddress });
        return res.data;
    },
};
