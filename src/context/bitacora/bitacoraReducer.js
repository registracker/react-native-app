export const bitacoraRecuder = (state, action) => {
  switch (state.type) {
    case 'obtener':
      return {
        ...state,
        medios: action.payload.medios,
        incidentes: action.payload.incidentes,
        marcadores: action.payload.marcadores,
        vehiculos: action.payload.medios,
      };

    default:
      return state;
  }
}
