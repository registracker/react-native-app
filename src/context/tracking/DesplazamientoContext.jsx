import React, {useReducer, createContext} from 'react';
import { desplazamientoReducer } from './desplazamientoReducer';

export const DesplazamientoContext = createContext();

const desplazamientoInicial = {
  uuid: undefined,
  createdAt: undefined,
  detainedAt: undefined,
  tracking: undefined,
  listMedios: [],
  countGrupo: 0,
};

export const DesplazamientoProvider = ({children}) => {

    const [desplazamientoState, dispatch] = useReducer(desplazamientoReducer, desplazamientoInicial)

    /**
     * TODO: Implement initialization desplazamiento, Restore desplazamiento
     */

    const agregarMedioDesplazamiento = (medio) => {
        dispatch({ type: 'agregar_medio', payload: { medio } })
    }

    return (
        <DesplazamientoContext.Provider 
        value={{
                ...desplazamientoState,
                agregarMedioDesplazamiento
        }}>
            {children}
        </DesplazamientoContext.Provider>
    )
};
