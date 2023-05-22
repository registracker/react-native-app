import React, { useReducer, createContext, useContext } from 'react'
import { catalogosReducer } from './catalogosReducer';

import { getMediosDesplazamientos } from '../../services/mediosDesplazamientoServices';
import { getIncidentes } from '../../services/incidenteServices';
import { getMarcadores } from '../../services/marcadorServices';
import { getVehiculos } from '../../services/vehiculos';
import { format } from 'date-fns';

import { dropIncidentes, getIncidentesDatabase, storeCatalogoIncidentes } from '../../database/TblIncidentes';
import { getVehiculosDatabase, storeVehiculosDatabase } from '../../database/TblVehiculos';
import { NetworkContext } from '../network/NetworkContext';
import { getMarcadoresDatabase } from '../../database/TblMarcadores';
import { dropMediosDesplazamientos, getMediosDesplazamientosDatabase } from '../../database/TblMediosDesplazamientos';
import { getBitacotaDatabase, storeBitacoraDatabase } from '../../database/TblBitacora';
import { storeCatalogoMediosDesplazamientos } from '../../database/TblMediosDesplazamientos';
import { getBitacota } from '../../services/bitacoraServices';


export const CatalogosContext = createContext();

const catalogosInicial = {
    ctl_medios_desplazamientos: {},
    ctl_incidentes: {},
    clt_marcadores: {},
    clt_vehiculos: {},
}

export const CatalogosProvider = ({ children }) => {

    const [catalogosState, dispatch] = useReducer(catalogosReducer, catalogosInicial)

    const { isConnected } = useContext(NetworkContext)

    const obtenerMediosDesplazamientos = async () => {
        if (isConnected) {
            const data = await getMediosDesplazamientos()
            if (data) {
                const {rows}  = await getBitacotaDatabase('medios_deplazamiento')
                const bitacora = rows.raw() 
                if (bitacora.length > 0){


                    
                } else {
                    
                    // await storeCatalogoMediosDesplazamientos(data)
                    // const response = await getMediosDesplazamientosDatabase()
                    await obtenerBitacora()

                }
                dispatch({ type: 'medios_desplazamientos', payload: { data, update: format(new Date(), 'dd-MM-yyyy HH:mm:ss') } })
                // actualizarBitacora()
                return true
            } else {
                obtenerMediosDesplazamientos()
            }
        } else {
            const data = await getMediosDesplazamientosDatabase();
            dispatch({ type: 'medios_desplazamientos', payload: { data } })
            return true
        }
    }

    const obtenerIncidentes = async () => {

        if (isConnected) {
            const data = await getIncidentes()
            if (data) {
                dispatch({ type: 'ctl_incidentes', payload: { data, update: format(new Date(), 'dd-MM-yyyy HH:mm:ss') } })
                return true
            } else {
                obtenerIncidentes()
            }
        } else {
            const incidentes = await getIncidentesDatabase();
            dispatch({ type: 'ctl_incidentes', payload: { data: incidentes } })
            return true

        }

    }

    const obtenerMarcadores = async () => {
        if (isConnected) {
            const data = await getMarcadores()
            if (data) {
                dispatch({ type: 'clt_marcadores', payload: { data, update: format(new Date(), 'dd-MM-yyyy HH:mm:ss') } })
                return true
            } else {
                await obtenerMarcadores();
            }
        } else {
            const data = await getMarcadoresDatabase();
            dispatch({ type: 'clt_marcadores', payload: { data } })
            return true
        }

    }


    const obtenerVehiculos = async () => {
        if (isConnected) {
            const data = await getVehiculos()
            if (data || data !== undefined) {
                data.forEach(element => {
                    element.contador = 0
                });
                
                dispatch({ type: 'ctl_vehiculos', payload: { data, update: format(new Date(), 'dd-MM-yyyy HH:mm:ss') } })
                return true
            }
            else {
                await obtenerVehiculos()
            }
        } else {
            const data = await getVehiculosDatabase()
            dispatch({ type: 'ctl_vehiculos', payload: { data } })
            return true
        }
    }


    const getCatalogos = async () => {
        try {
            const [medios, incidente, marcador, vehiculo] = await Promise.all([
                obtenerMediosDesplazamientos,
                obtenerIncidentes,
                obtenerMarcadores,
                obtenerVehiculos
            ])
        } catch (error) {

        }
    }

    const obtenerBitacora = async() => {
        const bitacora = await getBitacota()
        console.log("🚀 ~ file: CatalogosContext.jsx:137 ~ getBitacora ~ bitacora:", bitacora)
        await storeBitacoraDatabase(bitacora)
        

    }

    return (
        <CatalogosContext.Provider
            value={{
                ...catalogosState,
                obtenerMediosDesplazamientos,
                obtenerIncidentes,
                obtenerVehiculos,
                getCatalogos,
            }}
        >
            {children}
        </CatalogosContext.Provider>
    )
}