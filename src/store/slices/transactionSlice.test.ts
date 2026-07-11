import reducer, { setTransactionData, clearTransactionData } from './transactionSlice';

describe('transactionSlice Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      transactionData: null,
    });
  });

  it('should handle setTransactionData', () => {
    const previousState = { transactionData: null };
    const mockData = { id: 'txn_123', status: 'APPROVED' };
    
    expect(reducer(previousState, setTransactionData(mockData))).toEqual({
      transactionData: mockData,
    });
  });

  it('should handle clearTransactionData', () => {
    const previousState = { transactionData: { id: 'txn_123' } };
    
    expect(reducer(previousState, clearTransactionData())).toEqual({
      transactionData: null,
    });
  });
});
