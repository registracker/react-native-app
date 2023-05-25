export const incidenteReducer = (state, action) => {
  switch (action.type) {
    case 'crear':
      return {
        ...state,
      };
    default:
      return state;
  }
};
