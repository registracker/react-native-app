import Geolocation from 'react-native-geolocation-service';
import {createTableDesplazamiento} from '../database/TblDesplazamientos';
import {createTableMediosDesplazamiento} from '../database/TblMediosDesplazamientos';
import {
  createTableIncidentes,
  createTableReporteIncidentes,
} from '../database/TblIncidentes';
import {createTableMarcadores} from '../database/TblMarcadores';
import {createTableReporteMarcador} from '../database/TblReporteMarcador';

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
};
