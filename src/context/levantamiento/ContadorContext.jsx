import { useReducer } from "react";
import { createContext } from "react";
import { contadorReducer } from "./contadorReducer";

import { getLevantamientoContador } from '../../services/levantamientoServices'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

import { enviarReporte } from '../../services/vehiculos';
import { useContext } from "react";
import { CatalogosContext } from "../store/CatalogosContext";
import { NetworkContext } from "../network/NetworkContext";
import { sincronizarContadorDatabase, storeReporteContadorDatabase, updateAllContadorDatabase } from "../../database/TblReporteContador";
import { showToast } from "../../utils/toast";

export const ContadorContext = createContext()

const contadorInicial = {
    listado: [],
    levantamiento: undefined,
    fecha_vencimiento: undefined,
    activo: undefined,
    contador: [],
    ultimo: undefined,
}

export const ContadorProvider = ({ children }) => {

    const [contadorState, dispatch] = useReducer(contadorReducer, contadorInicial)

    const { ctl_vehiculos } = useContext(CatalogosContext)
    const { isConnected } = useContext(NetworkContext)

    const guardar = async (levantamiento) => {
        const { data, status } = await getLevantamientoContador(levantamiento)
        if (data) {
            if (status === 200) {
                await AsyncStorage.setItem('levantamiento-contador', JSON.stringify(data))

                const vehiculos = await AsyncStorage.getItem('listado-vehiculos')
                const lista = vehiculos != null ? JSON.parse(vehiculos) : null
                if (lista) {
                    const filtroVehiculos = ctl_vehiculos?.data.filter((obj) => lista.some((element) => element === obj.id));
                    dispatch({
                        type: 'guardar',
                        payload: {
                            fecha_vencimiento: data.fecha_vencimiento,
                            levantamiento: data,
                            listado: filtroVehiculos
                        }
                    })
                    return filtroVehiculos

                } else {
                    dispatch({
                        type: 'guardar',
                        payload: {
                            fecha_vencimiento: data.fecha_vencimiento,
                            levantamiento: data,
                            listado: ctl_vehiculos.data
                        }
                    })
                    return ctl_vehiculos.data
                }

            }
        } else {
            await guardar(levantamiento)
        }
    }

    const conectarse = async () => {
        const previo = await AsyncStorage.getItem('levantamiento-contador')
        if (previo) {

            const levantamiento = JSON.parse(previo);
            const contador = [...ctl_vehiculos.data]
            contador.forEach(element => {
                element.contador = 0
            });
            const vehiculos = await AsyncStorage.getItem('listado-vehiculos')
            const lista = vehiculos != null ? JSON.parse(vehiculos) : null
            if (lista) {
                const filtroVehiculos = ctl_vehiculos.data.filter((obj) => lista.some((element) => element === obj.id));
                dispatch({
                    type: 'guardar',
                    payload: {
                        fecha_vencimiento: levantamiento.fecha_vencimiento,
                        levantamiento,
                        listado: filtroVehiculos
                    }
                })
            } else {
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
    }

    const restablecer = async () => {
        await AsyncStorage.removeItem('levantamiento-contador')
        await AsyncStorage.removeItem('listado-vehiculos')
        await AsyncStorage.removeItem('contador')
        dispatch({ type: 'restablecer' })
    }

    const enviar = async (data) => {
        const contador = await AsyncStorage.getItem('opcion-contador');
        if (isConnected && contador === 'activo') {
            const response = await enviarReporte(data);

            showToast('Registros de conteo vehicular registrados');

        } else {
            showToast('Registros de conteo vehicular registrados temporalmente');
            await storeReporteContadorDatabase(data)
        }

        dispatch({ type: 'restablecer-contador' })
    }

    const agregarRegistro = (id) => {
        const registro = {
            id_levantamiento_contador: contadorState.levantamiento.id,
            codigo: contadorState.levantamiento.codigo,
            id_vehiculo: id,
            registrado: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        dispatch({ type: 'agregar', payload: { registro } })
    }

    const actualizarConteo = (contador) => {
        dispatch({ type: 'actualizar', payload: { contador } })
    }

    const actualizarListado = async (items) => {
        await AsyncStorage.setItem('listado-vehiculos', JSON.stringify(items))
        const vehiculos = ctl_vehiculos.data.filter((obj) => items.some((element) => element === obj.id));
        dispatch({ type: 'actualizar-listado', payload: { vehiculos } });
    }

    const getUltimoContador = async () => {
        const c = await AsyncStorage.getItem('levantamiento-contador')
        const contador = c != null ? JSON.parse(c) : null

        dispatch({ type: 'get-ultimo-contador', payload: { ultimo: contador } });
        return contador
    }

    const sincronizarContadores = async() => {
        const contador = await AsyncStorage.getItem('opcion-contador');
        if (contador !== 'activo') {
            const datos = await sincronizarContadorDatabase()
            if(datos.length > 0){
                const database = datos.map(item =>JSON.parse(item.contador))         
                const {status} = await enviarReporte(database);
                if(status === 200){
                    updateAllContadorDatabase()
                    showToast('Contador sincronizados')
                }
            }
        }
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
            actualizarListado,
            getUltimoContador,
            sincronizarContadores,
        }} >
            {children}
        </ContadorContext.Provider>
    )
}