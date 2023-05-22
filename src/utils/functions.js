import Geolocation from 'react-native-geolocation-service';
import {
  createTableDesplazamiento,
  limpiarDesplazamientoTable,
} from '../database/TblDesplazamientos';
import {createTableMediosDesplazamiento} from '../database/TblMediosDesplazamientos';
import {
  createTableIncidentes,
  createTableReporteIncidentes,
  limpiarIncidenteTable,
} from '../database/TblIncidentes';
import {createTableMarcadores} from '../database/TblMarcadores';
import {
  createTableReporteMarcador,
  limpiarMarcadoresTable,
} from '../database/TblReporteMarcador';
import {createTableVehiculos} from '../database/TblVehiculos';

export const getUbicacionActual = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
      },
    );
  });
};

export const createTables = () => {
  createTableDesplazamiento();
  createTableMediosDesplazamiento();
  createTableIncidentes();
  createTableReporteIncidentes();
  createTableMarcadores();
  createTableReporteMarcador();
  createTableVehiculos();
  console.log('CREATED TABLES');
};

export const limpiarRegistros = () => {
  limpiarDesplazamientoTable();
  limpiarIncidenteTable();
  limpiarMarcadoresTable();
};
