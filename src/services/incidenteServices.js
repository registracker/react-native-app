/* eslint-disable prettier/prettier */
import {http_axios} from '../config/axios';
import { getIncidentesDatabase, storeCatalogoIncidentes } from '../database/TblIncidentes';

const getIncidentes = async () => {
  // GET DATA OF SQLITE
  const incidentes = await getIncidentesDatabase();
  if (incidentes.length > 0) {
    return incidentes;
  }

  //GET DATA OF BACKEND IF YOU DO NOT FIND DATA FROM SQLITE
  let data = null
  do {
    const response = await http_axios('/api/incidentes');
    console.log("🚀 ~ file: incidenteServices.js:16 ~ getIncidentes ~ response:", response)
    data = response.data;
    if (data) {
      const inserting_incidentes = data.map(item => {
        return `(${item.id}, '${item.nombre}', '${item.icono}'),`;
      });
  
      const result = await storeCatalogoIncidentes(
        inserting_incidentes.join(' '),
      );
      if (result.rowsAffected === 1) {
        console.log('Data Insertada correctamente');
      }
    }

  }
  while (!data);
};


const postIncidente = async (data) => {
  await http_axios('/api/reporte-incidente',null, 'post', data);
};

module.exports = {
  getIncidentes,
  postIncidente,
};
