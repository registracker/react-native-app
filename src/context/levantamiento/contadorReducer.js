export const contadorReducer = (state, action) => {
  switch (action.type) {
    case 'guardar':
      return {
        ...state,
        levantamiento: action.payload.levantamiento,
        fecha_vencimiento: action.payload.fecha_vencimiento,
        listado: action.payload.listado,
        contador: action.payload.listado,
        activo: true,
      };
    case 'listado':
      return {
        ...state,
        listado: action.payload.data,
        contador: action.payload.data,

      };
    case 'restablecer':
      return {
        ...state,
        listado: state.contador,
        vehiculos: [],
        levantamiento: undefined,
        fecha_vencimiento: undefined,
        activo: undefined,
      };
    case 'sumar':
      return {
        ...state,
        listado: action.payload.data,
        vehiculos: [...state.vehiculos, action.payload.registro],
      };
    case 'restar':
      return {
        ...state,
        listado: action.payload.data,
        vehiculos: action.payload.registro,
      };
    default:
      return state;
  }
};
