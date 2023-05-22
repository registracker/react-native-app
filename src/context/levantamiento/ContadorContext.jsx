import { useReducer } from "react";
import { createContext } from "react";
import { contadorReducer } from "./contadorReducer";

import { getLevantamientoContador } from '../../services/levantamientoServices'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareAsc, format } from "date-fns";

import { getVehiculos, enviarReporte } from '../../services/vehiculos';
import { useContext } from "react";
import { CatalogosContext } from "../store/CatalogosContext";
import { NetworkContext } from "../network/NetworkContext";

export const ContadorContext = createContext()

const contadorInicial = {
    listado: [],
    levantamiento: undefined,
    fecha_vencimiento: undefined,
    activo: undefined,
    contador: [],
}

export const ContadorProvider = ({ children }) => {

    const [contadorState, dispatch] = useReducer(contadorReducer, contadorInicial)

    const { clt_vehiculos } = useContext(CatalogosContext)
    const {isConnected} = useContext(NetworkContext)

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

    const conectarse = async () => {
        const previo = await AsyncStorage.getItem('levantamiento-contador')
        if (previo) {

            const levantamiento = JSON.parse(previo);
            const contador = [...clt_vehiculos.data]
            contador.forEach(element => {
                element.contador = 0
            });

            dispatch({
                type: 'guardar',
                payload: {
                    fecha_vencimiento: levantamiento.fecha_vencimiento,
                    levantamiento,
                    listado: contador
                }
            })
        }
    }


    const restablecer = async () => {
        await AsyncStorage.removeItem('levantamiento-contador')
        dispatch({ type: 'restablecer' })
    }

    const enviar = async () => {

        if( isConnected  ) {
            const response = await enviarReporte(contadorState.contador);
            console.log("🚀 ~ file: ContadorContext.jsx:84 ~ enviar ~ response:", response)
        } else {
            // TODO: GUARDAR EN SQLITE
            console.log('guardar SQLITE');
        }

        dispatch({ type:'restablecer-contador' })
    }

    const agregarRegistro = (id) => {
        const registro = {
            id_levantamiento_contador: contadorState.levantamiento.id,
            id_vehiculo: id,
            registrado: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        dispatch({ type: 'agregar', payload:{ registro } })
    }

    const actualizarConteo = (contador) => {
        dispatch({ type: 'actualizar', payload: { contador } })
    }
    return (
        <ContadorContext.Provider value={{
            ...contadorState,
            guardar,
            restablecer,
            enviar,
            conectarse,
            agregarRegistro,
            actualizarConteo,
        }} >
            {children}
        </ContadorContext.Provider>
    )
}