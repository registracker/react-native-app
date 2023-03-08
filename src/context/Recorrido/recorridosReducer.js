/* eslint-disable prettier/prettier */
import { format } from "date-fns";
// generaEstado
export const recorridosReducer = (state, action) => {
  switch (action.type) {
    case 'insertar':
      return {
        ...state,
        uuid: action.payload.uuid,
        desplazamiento: [...state.desplazamiento, action.payload.punto],
        cantidadPuntos: state.desplazamiento.length + 1,
        ultimaActualizacion: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        ultimoPunto: action.payload.punto
      }
    case 'restaurar':
      return {
        ...state,
        desplazamiento: [],
        cantidadPuntos: 0,
        ultimoPunto: {},
        ultimaActualizacion: '',
      }
    default:
      return state;
  }
};
