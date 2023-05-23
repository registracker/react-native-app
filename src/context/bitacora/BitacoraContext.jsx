import { createContext, useReducer } from 'react';
import { bitacoraRecuder } from './bitacoraReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { NetworkContext } from '../network/NetworkContext';
import { getBitacota } from '../../services/bitacoraServices';
import { actualizarBitacora, getBitacotaDatabase, storeBitacoraDatabase } from '../../database/TblBitacora';
import { isEqual } from 'date-fns';
import { dropIncidentes, storeCatalogoIncidentes } from '../../database/TblIncidentes';
import { dropMarcadoresDatabase, storeCatalogoMarcadores } from '../../database/TblMarcadores';

import { getMediosDesplazamientos } from '../../services/mediosDesplazamientoServices';
import { getIncidentes } from '../../services/incidenteServices';
import { getMarcadores } from '../../services/marcadorServices';
import { getVehiculos } from '../../services/vehiculos';
import { storeCatalogoMediosDesplazamientos } from '../../database/TblMediosDesplazamientos';
import { dropVehiculosDatabase, storeVehiculosDatabase } from '../../database/TblVehiculos';
import { dropMediosDesplazamientos } from '../../database/TblMediosDesplazamientos';

export const BitacoraContext = createContext();

const bitacoraInicial = {
    medios: undefined,
    incidentes: undefined,
    marcadores: undefined,
    vehiculos: undefined,
};


export const BitacoraProvider = ({ children }) => {


    const [bitacoraState, dispatch] = useReducer(bitacoraRecuder, bitacoraInicial)
    const { isConnected } = useContext(NetworkContext)

    obtenerBitacora = async () => {
        const data = await getBitacotaDatabase()

        if (data.length === 0 && isConnected) {
            try {
                const bitacora = await getBitacota()
                await storeBitacoraDatabase(bitacora)
                dispatch({ type: 'obtener', bitacora })
            } catch (e) {
                console.log(e);
            }
        } else if (isConnected) {
            const newBitacora = await getBitacota()
            const compare = compararArrays(data, newBitacora)
            actualizarCatalogo(compare)

        }

        dispatch({ type: 'obtener', bitacora: data })
    }

    const compararArrays = (array1, array2) => {
        const elementosDiferentes = [];
        if (array1.length !== array2.length) {
            return elementosDiferentes;
        }
        for (let i = 0; i < array1.length; i++) {
            if (!isEqual(new Date(array1[i].fecha_actualizado), new Date(array2[i].actualizado))) {
                elementosDiferentes.push(array2[i]);
            }
        }
        return elementosDiferentes;
    }

    const actualizarCatalogo = async (compare) => {

        for await (const elemento of compare) {
            switch (elemento.nombre_tabla) {
                case 'incidentes':
                    await dropIncidentes()
                    const incidentes = await getIncidentes()
                    await storeCatalogoIncidentes(incidentes)
                    await actualizarBitacora('incidentes', elemento.actualizado)
                    break;
                case 'marcadores':
                    await dropMarcadoresDatabase()
                    const marcadores = await getMarcadores()
                    await storeCatalogoMarcadores(marcadores)
                    await actualizarBitacora('marcadores', elemento.actualizado)
                    break;
                case 'medios_desplazamiento':
                    await dropMediosDesplazamientos()
                    const medios = await getMediosDesplazamientos()
                    await storeCatalogoMediosDesplazamientos(medios)
                    await actualizarBitacora('medios_desplazamiento', elemento.actualizado)
                    break;
                case 'vehiculos':
                    await dropVehiculosDatabase()
                    const vehiculos = await getVehiculos()
                    vehiculos.forEach(element => {
                        element.contador = 0
                    });
                    await storeVehiculosDatabase(vehiculos)
                    await actualizarBitacora('vehiculos', elemento.actualizado)
                    break;

                default:
                    break;
            }
        }
    }
    return (
        <BitacoraContext.Provider value={{
            ...bitacoraState,
            obtenerBitacora,
        }}>
            {children}
        </BitacoraContext.Provider>
    )
}