/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http_axios } from '../config/axios';
import {
  actualizarMarcador,
  storeReporteMarcador,
} from '../database/TblReporteMarcador';

const getLevantamiento = async codigo => {
  try {
    const { data, status } = await http_axios(`/api/levantamientos/${codigo}`);
    return {
      data: data.data,
      status,
    };
  } catch (error) {
    return {
      data: [],
      status: 400,
    };
  }
};

const postLevantamiento = async (datos, automatico = true) => {
  try {
    if (automatico) {
      const opcionMarcador = await AsyncStorage.getItem('opcion-marcador');
      console.log('🚀 ~ file: levantamientoServices.js:27 ~ postLevantamiento ~ opcionMarcador:', opcionMarcador);
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
    console.log(
      '🚀 ~ file: levantamientoServices.js:28 ~ postLevantamiento ~ error:',
      error,
    );
    return false;
  }
};

module.exports = {
  getLevantamiento,
  postLevantamiento,
};
