/* eslint-disable prettier/prettier */
// generaEstado
export const recorridosReducer = (state, action) => {
  switch (action.type) {
    case 'insertar':
      return {
        ...state,
        uuid: action.payload.uuid,
        desplazamiento: [...state.desplazamiento, action.payload.punto],
        cantidadPuntos: state.desplazamiento.length + 1,
        ultimaActualizacion: new Date(),
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
