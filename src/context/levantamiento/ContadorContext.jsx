import { useReducer } from "react";
import { createContext } from "react";
import { contadorReducer } from "./contadorReducer";

import { getLevantamientoContador } from '../../services/levantamientoServices'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareAsc, format } from "date-fns";

import { getVehiculos, enviarReporte } from '../../services/vehiculos';

export const ContadorContext = createContext()

const contadorInicial = {
    contador: [],
    listado: [],
    vehiculos:[],
    levantamiento: undefined,
    fecha_vencimiento: undefined,
    activo: undefined,
}

export const ContadorProvider = ({children}) => {

    const [contadorState, dispatch] = useReducer(contadorReducer, contadorInicial)

    const guardar = async(levantamiento) => {
        await AsyncStorage.removeItem('levantamiento-contador')
        const { data, status } = await getLevantamientoContador(levantamiento)
        if (data) {
            if (status === 200) {
                await AsyncStorage.setItem('levantamiento-contador', JSON.stringify(data))
                dispatch({ type: 'guardar', payload: { fecha_vencimiento: data.fecha_vencimiento, levantamiento: data}})
                return true
            }
            return false
        } else {
            await guardar(levantamiento)
        }
        return true
    }

    const obtenerVehiculos = async () => {
        const data = await getVehiculos()
        if (data) {
            data.forEach(element => {
                element.contador = 0
            });
            dispatch({ type: 'listado', payload: { data}})
        }
        else {
            await obtenerVehiculos()
        }
    }
    
    const verificar = async() => {
        const previo = await AsyncStorage.getItem('levantamiento-contador')
        console.log("🚀 ~ file: ContadorContext.jsx:41 ~ verificar ~ previo:", previo)
        if (previo) {
            const levantamiento = JSON.parse(previo);
            const { periodo_fin } = levantamiento
            const [year, month, day] = periodo_fin.split('-');
            const fecha = new Date(year, month - 1, day);
            const valido = compareAsc(fecha, new Date())
            if (valido === 1) {
                dispatch({ type: 'guardar', payload: { levantamiento, fecha_vencimiento: periodo_fin } })
            } else {
                await restablecer()
            }
        }
        await obtenerVehiculos();

    }

    const restablecer = async () => {
        await AsyncStorage.removeItem('levantamiento-contador')
        dispatch({ type: 'restablecer' })
    }

    const sumar = (index) => {   
        contadorState.listado[index].contador = contadorState.listado[index].contador + 1
        const vehiculo = contadorState.listado[index]

        const registro = {
            id_levantamiento_contador: contadorState.levantamiento.id,
            id_vehiculo: vehiculo.id,
            registrado: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        
        dispatch({type: 'sumar', payload: { data: contadorState.listado}})
        dispatch({type: 'registrar', payload: { registro }})
    }

    const enviar = async() => {
        const data = {
            resources: contadorState.vehiculos
        }
        console.log("🚀 ~ file: ContadorContext.jsx:97 ~ enviar ~ data:", data)
        await enviarReporte(data)
        contadorState.listado.forEach(element => {
            element.contador = 0
        });
        dispatch({ type: 'listado', payload: { data: contadorState.listado  } })

    }

    return (
        <ContadorContext.Provider value={{
            ...contadorState,
            guardar,
            verificar,
            restablecer,
            sumar,
            enviar,
        }} >
            {children}
        </ContadorContext.Provider>
    )
}