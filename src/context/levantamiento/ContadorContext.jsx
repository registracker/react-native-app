import { useReducer } from "react";
import { createContext } from "react";
import { contadorReducer } from "./contadorReducer";

import { getLevantamientoContador } from '../../services/levantamientoServices'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareAsc, format } from "date-fns";

import { getVehiculos, enviarReporte } from '../../services/vehiculos';
import { useContext } from "react";
import { CatalogosContext } from "../store/CatalogosContext";

export const ContadorContext = createContext()

const contadorInicial = {
    listado: [],
    levantamiento: undefined,
    fecha_vencimiento: undefined,
    activo: undefined,
}

export const ContadorProvider = ({ children }) => {

    const [contadorState, dispatch] = useReducer(contadorReducer, contadorInicial)

    const { clt_vehiculos } = useContext(CatalogosContext)

    const guardar = async (levantamiento) => {
        const { data, status } = await getLevantamientoContador(levantamiento)
        if (data) {
            if (status === 200) {
                await AsyncStorage.setItem('levantamiento-contador', JSON.stringify(data))
                dispatch({
                    type: 'guardar',
                    payload: {
                        fecha_vencimiento: data.fecha_vencimiento,
                        levantamiento: data,
                        listado: clt_vehiculos.data
                    }
                })
                return clt_vehiculos.data
           }
            // console.log("🚀 ~ file: ContadorContext.jsx:48 ~ guardar")
            // return []
        } else {
            await guardar(levantamiento)
        }
    }


    const restablecer = async () => {
        await AsyncStorage.removeItem('levantamiento-contador')
        dispatch({ type: 'restablecer' })
    }

    const enviar = async (data) => {
        // console.log("🚀 ~ file: ContadorContext.jsx:57 ~ enviar ~ data:", data)
        // const response = await enviarReporte(data);
    }

    return (
        <ContadorContext.Provider value={{
            ...contadorState,
            guardar,
            restablecer,
            enviar
        }} >
            {children}
        </ContadorContext.Provider>
    )
}