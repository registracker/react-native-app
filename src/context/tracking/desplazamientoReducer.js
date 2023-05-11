import {format} from 'date-fns';

export const desplazamientoReducer = (state, action) => {
  switch (action.type) {
    case 'iniciar':
      return {
        ...state,
        uuid: action.payload.uuid,
        createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        detainedAt: null,
        tracking: [],
        listMedios: [],
        countGrupo: 0,
      };
    case 'detener':
      return {
        ...state,
        uuid: undefined,
        createdAt: undefined,
        detainedAt: undefined,
        tracking: undefined,
        listMedios: undefined,
        countGrupo: undefined,
      };
    case 'agregar_medio':
      return {
        ...state,
        listMedios: [...state.listMedios, action.payload.medio],
        countGrupo: state.countGrupo + 1,
      };
    case 'aumentar_costo':
      return {
        ...state,
        listMedios: action.payload.listado,
      };
    case 'reducir_costo':
      return {
        ...state,
        listMedios: action.payload.listado,
      };
    case 'agregar_costo':
      return {
        ...state,
        listMedios: action.payload.costos,
      };
    default:
      return state;
  }
};
