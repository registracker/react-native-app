export const contadorReducer = (state, action) => {
  switch (action.type) {
    case 'guardar':
      return {
        ...state,
        levantamiento: action.payload.levantamiento,
        fecha_vencimiento: action.payload.fecha_vencimiento,
        activo: true,
      };
    case 'listado':
      return {
        ...state,
        listado: action.payload.data,
      };
    case 'restablecer':
      return {
        ...state,
        contador: [],
        listado: [],
        vehiculos: [],
        levantamiento: undefined,
        fecha_vencimiento: undefined,
        activo: undefined,
      };
    case 'sumar':
      return {
        ...state,
        listado: action.payload.data,
      };
    case 'registrar':
      return {
        ...state,
        vehiculos: [...state.vehiculos, action.payload.registro],
      };
    default:
      return state;
  }
};
