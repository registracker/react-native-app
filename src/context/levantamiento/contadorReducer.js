export const contadorReducer = (state, action) => {
  switch (action.type) {
    case 'guardar':
      return {
        ...state,
        levantamiento: action.payload.levantamiento,
        fecha_vencimiento: action.payload.fecha_vencimiento,
        listado: action.payload.listado,
        activo: true,
      };
    case 'restablecer':
      return {
        ...state,
        contador: [],
        listado: [],
        levantamiento: undefined,
        fecha_vencimiento: undefined,
        activo: false,
      };
    default:
      return state;
  }
};
