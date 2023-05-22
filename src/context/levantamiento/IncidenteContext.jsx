import { useContext, useReducer } from 'react';
import { createContext } from 'react';
import { incidenteReducer } from './incidenteReducer';
import { storeReporteIncidente } from '../../database/TblIncidentes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postIncidente } from '../../services/incidenteServices'
import { getUbicacionActual } from '../../utils/functions';
import { format } from 'date-fns';
import { NetworkContext } from '../network/NetworkContext';


export const IncidenteContext = createContext();

const incidenteInicial = {
    incidente: undefined,
};

export const IncidenteProvider = ({ children }) => {
    const [incidenteState, dispatch] = useReducer(incidenteReducer, incidenteInicial);

    const {isConnected} = useContext(NetworkContext)

    const crearIncidente = () => {
        dispatch({ type: 'crear' })
    }

    const enviarIncidente = async (incidente) => {
        const position = await getUbicacionActual();

        const data = {
            id_incidente: incidente.id,
            icono: incidente.icono,
            nombre: incidente.nombre,
            longitud: position.coords.longitude,
            latitud: position.coords.latitude,
            altitud: position.coords.altitude,
            fecha_reporte: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
        const response = await storeReporteIncidente(data);
        if (response.rowsAffected === 1) {

            const optionIncidente = await AsyncStorage.getItem('opcion-incidente');
            if (optionIncidente === 'activo' && isConnected) {
                await postIncidente(data)
                // await enviarIncidente(response.insertId)
            }

            // const mensaje = 'Incidente registrado';
            // const subtitulo = `${data.nombre} registrado la fecha de ${data.fecha_reporte}`;
            // notificacion(mensaje, subtitulo);
        }
    }

    return (
        <IncidenteContext.Provider value={{ crearIncidente, enviarIncidente }}>
            {children}
        </IncidenteContext.Provider>
    )
};
