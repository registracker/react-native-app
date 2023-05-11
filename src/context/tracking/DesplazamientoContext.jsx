import React, { useReducer, createContext } from 'react';
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

export const DesplazamientoProvider = ({ children }) => {

    const [desplazamientoState, dispatch] = useReducer(desplazamientoReducer, desplazamientoInicial)

    /**
     * TODO: Implement initialization desplazamiento, Restore desplazamiento
     */
    const iniciarDesplazamiento = (uuid) => {
        dispatch({ type: 'iniciar', payload: { uuid } })
    }

    const detenerDesplazamiento = () => {
        dispatch({ type: 'detener' })
    }

    const agregarMedioDesplazamiento = (medio) => {
        const ultimoMedio = desplazamientoState.listMedios[desplazamientoState.listMedios.length - 1]
        const item = {
            ...medio,
            costo: 0,
            grupo: desplazamientoState.countGrupo
        }
        if (desplazamientoState.listMedios.length === 0) {
            dispatch({ type: 'agregar_medio', payload: { medio: item } })
        }
        else if (ultimoMedio?.id !== medio.id) {
            dispatch({ type: 'agregar_medio', payload: { medio: item } })
        }
    }

    const aumentarCostoDesplazamiento = (index, aumentar) => {
        const costo = desplazamientoState.listMedios[index].costo
        const total = parseFloat(costo) + aumentar
        desplazamientoState.listMedios[index].costo = total.toFixed(2);
        dispatch({ type: 'actualizar_costo', payload: { listado: desplazamientoState.listMedios } })
    }

    const reducirCostoDesplazamiento = (index, reducir) => {
        const costo = desplazamientoState.listMedios[index].costo
        if(costo <= 0) return; 
        const total = parseFloat(costo) - reducir
        desplazamientoState.listMedios[index].costo = total.toFixed(2);
        dispatch({ type: 'actualizar_costo', payload: { listado: desplazamientoState.listMedios } })
    }

    const agregarCostoDesplazamiento = (index, costo) => {
        desplazamientoState.listMedios[index].costo = parseFloat(costo).toFixed(2);
        dispatch({ type: 'actualizar_costo', payload: { listado: desplazamientoState.listMedios } })
    }

    return (
        <DesplazamientoContext.Provider
            value={{
                ...desplazamientoState,
                agregarMedioDesplazamiento,
                agregarCostoDesplazamiento,
                aumentarCostoDesplazamiento,
                reducirCostoDesplazamiento,
                iniciarDesplazamiento,
                detenerDesplazamiento
            }}>
            {children}
        </DesplazamientoContext.Provider>
    )
};
