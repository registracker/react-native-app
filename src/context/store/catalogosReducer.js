export const catalogosReducer = (state, action) => {
  switch (action.type) {
    case 'medios_desplazamientos':
      return {
        ...state,
        ctl_medios_desplazamientos: {
          data: action.payload.data,
          lastUpdated: action.payload?.update
            ? action.payload.update
            : state.ctl_medios_desplazamientos.lastUpdated,
        },
      };
    case 'ctl_incidentes':
      return {
        ...state,
        ctl_incidentes: {
          data: action.payload.data,
          lastUpdated: action.payload?.update
            ? action.payload.update
            : state.ctl_medios_desplazamientos.lastUpdated,
        },
      };
    case 'clt_marcadores':
      return {
        ...state,
        clt_marcadores: {
          data: action.payload.data,
          lastUpdated: action.payload?.update
            ? action.payload.update
            : state.ctl_medios_desplazamientos.lastUpdated,
        },
      };
    case 'ctl_vehiculos':
      return {
        ...state,
        clt_vehiculos: {
          data: action.payload.data,
          lastUpdated: action.payload?.update
            ? action.payload.update
            : state.ctl_medios_desplazamientos.lastUpdated,
        },
      };
    default:
      return state;
  }
};
