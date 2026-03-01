import { create } from 'zustand';

export type TxStepStatus = 'idle' | 'preparing' | 'signing' | 'mining' | 'success' | 'error';

interface TxState {
    isModalOpen: boolean;
    status: TxStepStatus;
    txHash: string | null;
    errorMessage: string | null;
    openModal: () => void;
    closeModal: () => void;
    setStatus: (status: TxStepStatus, hash?: string, error?: string) => void;
    reset: () => void;
}

export const useTxStore = create<TxState>((set) => ({
    isModalOpen: false,
    status: 'idle',
    txHash: null,
    errorMessage: null,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false, status: 'idle', txHash: null, errorMessage: null }),
    setStatus: (status, hash = undefined, error = undefined) =>
        set((state) => ({
            status,
            txHash: hash !== undefined ? hash : state.txHash,
            errorMessage: error !== undefined ? error : state.errorMessage
        })),
    reset: () => set({ status: 'idle', txHash: null, errorMessage: null }),
}));
