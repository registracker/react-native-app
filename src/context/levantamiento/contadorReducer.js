/* eslint-disable prettier/prettier */
export const contadorReducer = (state, action) => {
  switch (action.type) {
    case 'guardar':
      return {
        ...state,
        levantamiento: action.payload.levantamiento,
        fecha_vencimiento: action.payload.fecha_vencimiento,
        listado: action.payload.listado,
        activo: true,
        contador: [],
      };
    case 'restablecer':
      return {
        ...state,
        listado: undefined,
        levantamiento: undefined,
        fecha_vencimiento: undefined,
        activo: false,
        contador: [],
      };
    case 'agregar':
      return {
        ...state,
        contador: [...state.contador, action.payload.registro],
      };
    case 'actualizar':
      return {
        ...state,
        contador: action.payload.contador,
      };
    case 'restablecer-contador':
      return {
        ...state,
        contador: [],
      };
    case 'actualizar-listado':
      return {
        ...state,
        listado: action.payload.vehiculos,
      };
    case 'get-ultimo-contador':
      return {
        ...state,
        ultimo: action.payload.contador,
      };
    default:
      return state;
  }
};
