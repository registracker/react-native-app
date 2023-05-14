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
    case 'registrar':
      return {
        ...state,
        tracking: [...state.tracking, action.payload.point],
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
        medioActivo: null,
      };
    case 'agregar_medio':
      return {
        ...state,
        listMedios: [...state.listMedios, action.payload.medio],
        countGrupo: state.countGrupo + 1,
        medioActivo: action.payload.medio,
      };
    case 'actualizar_medio':
      return {
        ...state,
        listMedios: action.payload.listMedios,
        medioActivo: action.payload.medio,
      };
    case 'actualizar_costo':
      return {
        ...state,
        listMedios: action.payload.listado,
      };
    default:
      return state;
  }
};
