export const contadorReducer = (state, action) => {
  switch (action.type) {
    case 'guardar':
      return {
        ...state,
        levantamiento: action.payload.levantamiento,
        fecha_vencimiento: action.payload.fecha_vencimiento,
        activo: true,
      };
      case 'restablecer':
      return {
        ...state,
        levantamiento: undefined,
        fecha_vencimiento: undefined,
        activo: false,
      }
    default:
      return state;
  }
};
