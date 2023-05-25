import Geolocation from 'react-native-geolocation-service';
import {
  createTableDesplazamiento,
  limpiarDesplazamientoTable,
} from '../database/TblDesplazamientos';
import {
  createTableMediosDesplazamiento,
  dropMediosDesplazamientos,
} from '../database/TblMediosDesplazamientos';
import {
  createTableIncidentes,
  createTableReporteIncidentes,
  dropIncidentes,
  limpiarIncidenteTable,
} from '../database/TblIncidentes';
import {
  createTableMarcadores,
  dropMarcadoresDatabase,
} from '../database/TblMarcadores';
import {
  createTableReporteMarcador,
  limpiarMarcadoresTable,
} from '../database/TblReporteMarcador';
import {
  createTableVehiculos,
  dropVehiculosDatabase,
} from '../database/TblVehiculos';
import {createTableBitacora} from '../database/TblBitacora';
import {createTableReporteContador} from '../database/TblReporteContador';

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
  createTableBitacora();
  createTableReporteContador();
};

export const limpiarRegistros = () => {
  limpiarDesplazamientoTable();
  limpiarIncidenteTable();
  limpiarMarcadoresTable();
};

export const limpiarCatalogos = async () => {
  await dropIncidentes();
  await dropMarcadoresDatabase();
  await dropMediosDesplazamientos();
  await dropVehiculosDatabase();
};
