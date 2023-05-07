/* eslint-disable prettier/prettier */
import { http_axios } from '../config/axios';


const getDepartamentos = async () => {
    // GET DATA OF SQLITE
    // const incidentes = await getIncidentesDatabase();
    // if (incidentes.length > 0) {
    //     return incidentes;
    // }

    //GET DATA OF BACKEND IF YOU DO NOT FIND DATA FROM SQLITE
    const response = await http_axios('/api/departamentos');
    const { data } = response.data;

    // if (data) {
    //     const inserting_incidentes = data.map(item => {
    //         return `(${item.id}, '${item.nombre}', '${item.icono}'),`;
    //     });

    //     const result = await storeCatalogoIncidentes(
    //         inserting_incidentes.join(' '),
    //     );
    //     if (result.rowsAffected === 1) {
    //     }
    // }

    return data;
};

export default {
    getDepartamentos
}