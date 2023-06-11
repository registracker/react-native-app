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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToast} from './toast';

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

export const getOptionEnvioAutomatico = async () => {
  const desplazamiento = await AsyncStorage.getItem('opcion-desplazamiento');
  const incidente = await AsyncStorage.getItem('opcion-incidente');
  const marcador = await AsyncStorage.getItem('opcion-marcador');
  const contador = await AsyncStorage.getItem('opcion-contador');

  if (!desplazamiento) {
    await AsyncStorage.setItem('opcion-desplazamiento', 'activo');
  }
  if (!incidente) {
    await AsyncStorage.setItem('opcion-incidente', 'activo');
  }
  if (!marcador) {
    await AsyncStorage.setItem('opcion-marcador', 'activo');
  }
  if (!contador) {
    await AsyncStorage.setItem('opcion-contador', 'activo');
  }
};

export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    showToast('Ocurrió un error al limpiar el almacenamiento local.');
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};
