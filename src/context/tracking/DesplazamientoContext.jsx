import React, { useReducer, createContext, useContext } from 'react';
import uuid from 'react-native-uuid';
import { desplazamientoReducer } from './desplazamientoReducer';

import { postDesplazamiento } from '../../services/desplazamientoServices.js';
import { addItemDesplazamiento, limpiarDesplazamientoDatatable, obtenerSinSincronzarDesplazamientos } from '../../database/TblDesplazamientos';
import { showToast } from '../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetworkContext } from '../network/NetworkContext';

export const DesplazamientoContext = createContext();

const desplazamientoInicial = {
    uuid: undefined,
    createdAt: undefined,
    detainedAt: undefined,
    tracking: undefined,
    listMedios: [],
    countGrupo: 0,
    medioActivo: null,
};

export const DesplazamientoProvider = ({ children }) => {

    const [desplazamientoState, dispatch] = useReducer(desplazamientoReducer, desplazamientoInicial)

    const {isConnected} = useContext(NetworkContext)

    /**
     * FUNCIONALIDAD PARA INICIAR DESPLAZAMIENTO
     */
    const iniciarDesplazamiento = () => {
        const id = uuid.v4()
        dispatch({ type: 'iniciar', payload: { uuid: id } })
    }

    /**
     * FUNCIONALIDAD PARA REGISTRAR CADA PUNTO DE GPS
     */
    const registrarDesplazamiento = (position, medio) => {
        const count = agregarMedioDesplazamiento(medio)
        const point = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            altitud: position.coords.altitude,
            fecha_registro: position.timestamp,
            velocidad: position.coords.speed,
            id_medio_desplazamiento: medio.id,
            agrupacion_medio_desplazamiento: count,
        };
        dispatch({ type: 'registrar', payload: { point } })
    }

    /**
     * FUNCIONALIDAD PARA ENVIAR EL DESPLAZAMIENTO
     */
    const enviarDesplazamiento = async (manual = false) => {

        if (desplazamientoState.tracking.length === 0) {
            showToast('Viaje demasiado corto')
            dispatch({ type: 'detener' })
            return;
        }

        const data = {
            uuid: desplazamientoState.uuid,
            desplazamiento: desplazamientoState.tracking,
            costos: desplazamientoState.listMedios
        }
        if (isConnected) {
            await postDesplazamiento(data, manual)
        } else {
            await addItemDesplazamiento(data);
            showToast('Desplazamiento almacenado temporalmente en el dispositivo')
        }
        dispatch({ type: 'detener' })
    }
    /**
     * FUNCIONALIDAD PARA ALMACENAR MEDIO DE DESPLAZAMIENTO
     */
    const agregarMedioDesplazamiento = (medio) => {
        if (desplazamientoState.medioActivo?.id !== medio.id) {
            const item = {
                ...medio,
                costo: 0,
                grupo: desplazamientoState.countGrupo + 1
            }
            dispatch({ type: 'agregar_medio', payload: { medio: item } })
            return desplazamientoState.countGrupo + 1
        }
        return desplazamientoState.countGrupo
    }

    const actualizarMedioDesplazamiento = (item) => {
        const medio = {
            ...desplazamientoState.medioActivo,
            costo: item.tarifa_autorizada,
            id_ruta: item.id,
            ruta: item.ruta
        }
        desplazamientoState.listMedios[desplazamientoState.listMedios.length - 1] = medio
        dispatch({ type: 'actualizar_medio', payload: { listMedios: desplazamientoState.listMedios, medio } })
    }

    /**
    * FUNCIONALIDAD PARA AGREGAR COSTO DE DESPLAZAMIENTO
    */
    const aumentarCostoDesplazamiento = (index, aumentar) => {
        const costo = desplazamientoState.listMedios[index].costo
        const total = parseFloat(costo) + aumentar
        desplazamientoState.listMedios[index].costo = total.toFixed(2);
        dispatch({ type: 'actualizar_costo', payload: { listado: desplazamientoState.listMedios } })
    }

    const reducirCostoDesplazamiento = (index, reducir) => {
        const costo = desplazamientoState.listMedios[index].costo
        if (costo <= 0) return;
        const total = parseFloat(costo) - reducir
        desplazamientoState.listMedios[index].costo = total.toFixed(2);
        dispatch({ type: 'actualizar_costo', payload: { listado: desplazamientoState.listMedios } })
    }

    const agregarCostoDesplazamiento = (index, costo) => {
        desplazamientoState.listMedios[index].costo = parseFloat(costo).toFixed(2);
        dispatch({ type: 'actualizar_costo', payload: { listado: desplazamientoState.listMedios } })
    }

    /**
     * METODOS PARA ENVIAR AUTOMATICO REGISTROS DE DESPLAZAMIENTOS
     */
    const sincronizarReporteDesplazamiento = async () => {
        const desplazamiento = await AsyncStorage.getItem('opcion-desplazamiento');
        if (desplazamiento === 'activo') {
            const data = await obtenerSinSincronzarDesplazamientos();
            if (data.length > 0) {

                for await (const item of data) {
                    const json = {
                        uuid: item.uuid,
                        desplazamiento: JSON.parse(item.desplazamiento),
                        costos: JSON.parse(item.costos)
                    }
                    await postDesplazamiento(json, true)
                }
                showToast('Desplazamientos sincronizados')
            }
        } else {
        }
    }
    return (
        <DesplazamientoContext.Provider
            value={{
                ...desplazamientoState,
                agregarCostoDesplazamiento,
                aumentarCostoDesplazamiento,
                reducirCostoDesplazamiento,
                iniciarDesplazamiento,
                registrarDesplazamiento,
                enviarDesplazamiento,
                agregarMedioDesplazamiento,
                actualizarMedioDesplazamiento,
                sincronizarReporteDesplazamiento
            }}>
            {children}
        </DesplazamientoContext.Provider>
    )
};
