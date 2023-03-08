import { createContext } from "react"
import { catalogosReducer } from "./catalogosReducer";

import { getMediosDesplazamientos } from '../services/mediosDesplazamientoServices';
import { getIncidentes } from '../services/incidenteServices';


export const CatalogosContext = createContext();

const catalogosInicial = {
    ctl_medios_desplazamientos: {},
    ctl_incidentes: {},
}

export const CatalogosProvider = ({ children }) => {

    const [catalogosState, dispatch] = useReducer(catalogosReducer, catalogosInicial)

    const obtenerMediosDesplazamientos = async () => {
        const data = await getMediosDesplazamientos()
        dispatch({ type: 'medios_desplazamientos', payload: { data } })
    }

    const obtenerIncidentes = async () => {
        const data = await getIncidentes()
        dispatch({ type: 'medios_desplazamientos', payload: { data } })
    }

    return (
        <CatalogosContext.Provider
            value={{
                ...catalogosInicial,
                obtenerMediosDesplazamientos,
                obtenerIncidentes
            }}
        >

        </CatalogosContext.Provider>
    )
}