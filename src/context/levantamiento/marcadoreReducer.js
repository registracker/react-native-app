export const marcadorReducer = (state, action) => {
  switch (action.type) {
    case 'guardar':
      return {
        ...state,
        levantamiento: action.payload.levantamiento,
        fecha_vencimiento: action.payload.fecha_vencimiento,
        valido: true,
      };
    case 'restablecer':
      return {
        ...state,
        levantamiento: undefined,
        fecha_vencimiento: undefined,
        valido: false,
      };
    default:
      return state;
  }
};
