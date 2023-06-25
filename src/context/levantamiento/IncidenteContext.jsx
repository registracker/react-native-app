import { useContext, useReducer } from 'react';
import { createContext } from 'react';
import { incidenteReducer } from './incidenteReducer';
import { enviarIncidenteDatabase, sincronizarIncidentesDatabase, storeReporteIncidente } from '../../database/TblIncidentes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postIncidente } from '../../services/incidenteServices'
import { format } from 'date-fns';
import { NetworkContext } from '../network/NetworkContext';
import { showToast } from '../../utils/toast';
import Geolocation from 'react-native-geolocation-service';


export const IncidenteContext = createContext();

const incidenteInicial = {
    incidente: undefined,
};

export const IncidenteProvider = ({ children }) => {
    const [incidenteState, dispatch] = useReducer(incidenteReducer, incidenteInicial);

    const { isConnected } = useContext(NetworkContext)

    const crearIncidente = () => {
        dispatch({ type: 'crear' })
    }

    const enviarIncidente = async (incidente) => {
        Geolocation.getCurrentPosition(
            async (position) => {
              const data = {
                    id_incidente: incidente.id,
                    icono: incidente.icono,
                    nombre: incidente.nombre,
                    longitud: position.coords.longitude,
                    latitud: position.coords.latitude,
                    altitud: position.coords.altitude,
                    fecha_reporte: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                };

                const optionIncidente = await AsyncStorage.getItem('opcion-incidente');
                if (optionIncidente === 'activo' && isConnected) {
                    const {status} = await postIncidente(data)
                    if (status === 201) {
                        data.enviado = 1
                        const response = await storeReporteIncidente(data);
                        if (response.rowsAffected === 1) {
                            showToast('Incidente registrado');
                        }
                    }
                } else {
                    const response = await storeReporteIncidente(data);
                    if (response.rowsAffected === 1) {
                        showToast('Incidente registrado temporalmente');
                    }
                }
            },
            (error) => {
              showToast('Habilitar ubicación')
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
        );
    }

    const sincronizarIncidentes = async () => {
        const incidente = await AsyncStorage.getItem('opcion-incidente');
        if (incidente === 'activo') {
            const data = await sincronizarIncidentesDatabase()
            if (data.length > 0) {
                for await (const item of data) {
                    await postIncidente(item)
                    await enviarIncidenteDatabase(item.id)
                }
                showToast('Incidentes sincronizados')
            }
        }
    }

    return (
        <IncidenteContext.Provider value={{
            crearIncidente,
            enviarIncidente,
            sincronizarIncidentes
        }}>
            {children}
        </IncidenteContext.Provider>
    )
};
