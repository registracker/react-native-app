export const networkReducer = (state, action) => {
  switch (action.type) {
    case 'status':
      return {
        ...state,
        isConnected: action.payload.isConnected,
        isWifiEnabled: action.payload.isWifiEnabled,
        type: action.payload.type,
      };

    default:
      return state;
  }
};
