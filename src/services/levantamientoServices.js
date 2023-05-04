/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http_axios } from '../config/axios';
import {
  enviarMarcador,
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

const postLevantamiento = async datos => {
  try {
    if(datos?.enviado === 1 ){
      return;
    }
    await storeReporteMarcador({ ...datos, enviado: 0 });
    const opcionMarcador = await AsyncStorage.getItem('opcion-marcador');
    if (opcionMarcador === 'inactivo') {
      return;
    } else {
      const { data, status } = await http_axios(
        '/api/reporte-marcadores',
        null,
        'post',
        datos,
      );
      if (status === 201) {
        await enviarMarcador(datos.id);
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
