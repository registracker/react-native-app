import { useReducer } from "react";
import { createContext } from "react";
import { contadorReducer } from "./contadorReducer";

import { getLevantamientoContador } from '../../services/levantamientoServices'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareAsc } from "date-fns";

export const ContadorContext = createContext()

const contadorInicial = {
    contador: 0,
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
    
    const verificar = async() => {
        const previo = await AsyncStorage.getItem('levantamiento-contador')
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

    }

    const restablecer = async () => {
        await AsyncStorage.removeItem('levantamiento-contador')
        dispatch({ type: 'restablecer' })
    }

    const agregarVehiculo = () => {
        console.log("object");
        dispatch({type: 'agregar'})
    }

    return (
        <ContadorContext.Provider value={{
            ...contadorState,
            guardar,
            verificar,
            agregarVehiculo,
            restablecer,
        }} >
            {children}
        </ContadorContext.Provider>
    )
}