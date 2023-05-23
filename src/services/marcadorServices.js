/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http_axios } from '../config/axios';
import { getMarcadoresDatabase, storeCatalogoMarcadores } from '../database/TblMarcadores';
import { actualizarMarcador, storeReporteMarcador } from '../database/TblReporteMarcador';

const getMarcadores = async () => {
  try {
    const response = await http_axios('/api/marcadores');
    const { data, status } = response.data;

    return data;
  } catch (error) {
    return [];
  }

};

const postReporteMarcador = async (datos, automatico = true) => {
  try {
    if (automatico) {
      const opcionMarcador = await AsyncStorage.getItem('opcion-marcador');
      if (opcionMarcador === 'activo') {
        const { data, status } = await http_axios(
          '/api/reporte-marcadores',
          null,
          'post',
          datos,
        );
        if (status === 201) {
          if (datos?.id) {
            await actualizarMarcador(datos.id);
          } else {
            await storeReporteMarcador({ ...datos, enviado: 1 });
          }
          return;
        }
      } else {
        await storeReporteMarcador(datos);
      }
    } else {
      const { data, status } = await http_axios(
        '/api/reporte-marcadores',
        null,
        'post',
        datos,
      );

      if (status === 201) {
        await actualizarMarcador(datos.id);
      }
    }

    return;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getMarcadores,
  postReporteMarcador,
};
