import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface TransactionState {
  transactionData: any | null;
}

const initialState: TransactionState = {
  transactionData: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionData: (state, action: PayloadAction<any>) => {
      state.transactionData = action.payload;
    },
    clearTransactionData: (state) => {
      state.transactionData = null;
    }
  }
});

export const { setTransactionData, clearTransactionData } = transactionSlice.actions;

// Thunk to securely save to local storage (Requirement 3 from PDF)
export const saveTransactionSecurely = (data: any) => async (dispatch: any) => {
  try {
    await SecureStore.setItemAsync('transaction_data', JSON.stringify(data));
    dispatch(setTransactionData(data));
  } catch (error) {
    console.error('Failed to securely save transaction', error);
  }
};

export default transactionSlice.reducer;
