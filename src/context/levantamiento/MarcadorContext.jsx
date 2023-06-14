

import { View, Text } from 'react-native'
import React from 'react'
import { createContext } from 'react'
import { useReducer } from 'react'
import { marcadorReducer } from './marcadoreReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLevantamientoMarcador } from '../../services/levantamientoServices'
import { compareAsc } from 'date-fns'
import { sincronizarMarcadoresDatabase } from '../../database/TblReporteMarcador'
import { postReporteMarcador } from '../../services/marcadorServices';
import { showToast } from '../../utils/toast'


export const MarcadorContext = createContext()

const marcadorInicial = {
    levantamiento: undefined,
    fecha_vencimiento: undefined,
    valido: undefined,
}

export const MarcadorProvider = ({ children }) => {

    const [marcadorState, dispatch] = useReducer(marcadorReducer, marcadorInicial)

    const guardar = async (levantamiento) => {
        const { data, status } = await getLevantamientoMarcador(levantamiento)
        if (data) {
            if (status === 200) {
                await AsyncStorage.setItem('levantamiento', JSON.stringify(data))
                dispatch({ type: 'guardar', payload: { levantamiento: data, fecha_vencimiento: data.fecha_vencimiento } })
                return true
            }
            return false
        } else {
            await guardar(levantamiento)
        }

    }

    const verificar = async () => {
        const previo = await AsyncStorage.getItem('levantamiento')
        if (previo) {
            const levantamiento = JSON.parse(previo);
            const { fecha_vencimiento } = levantamiento
            const [day, month, year] = fecha_vencimiento.split('-');
            const fecha = new Date(year, month - 1, day);
            const valido = compareAsc(fecha, new Date())
            if (valido === 1) {
                dispatch({ type: 'guardar', payload: { levantamiento, fecha_vencimiento } })
            } else {
                await restablecer()
            }
        }
    }

    const restablecer = async () => {
        await AsyncStorage.removeItem('levantamiento')
        dispatch({ type: 'restablecer' })
    }

    const sincronizarMarcadores = async () => {
        const marcador = await AsyncStorage.getItem('opcion-marcador');
        if (marcador === 'activo') {
            const data = await sincronizarMarcadoresDatabase()
            if (data.length > 0) {
                for await (const item of data) {
                    await postReporteMarcador(item, false)
                }
                showToast('Marcadores sincronizados')
            }
        }
    }

    const getUltimoMarcador = async () => {
        const m = await AsyncStorage.getItem('levantamiento')
        const marcador = m != null ? JSON.parse(m) : null
        dispatch({ type: 'get-ultimo-marcador', payload: { ultimo: marcador } });
        return marcador
    }

    return (
        <MarcadorContext.Provider
            value={{
                ...marcadorState,
                guardar,
                verificar,
                restablecer,
                sincronizarMarcadores,
                getUltimoMarcador
            }}
        >
            {children}
        </MarcadorContext.Provider  >
    )
}