import AsyncStorage from '@react-native-async-storage/async-storage';
import {http_axios} from '../config/axios';
import {storeReporteMarcador} from '../database/TblReporteMarcador';

const getLevantamiento = async codigo => {
  try {
    const {data, status} = await http_axios(`/api/levantamientos/${codigo}`);
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
    await storeReporteMarcador(datos);
    const opcionMarcador = await AsyncStorage.getItem('opcion-marcador');
    if (opcionMarcador === 'inactivo') {
      return;
    }

    const {data, status} = await http_axios(
      '/api/reporte-marcadores',
      null,
      'post',
      datos,
    );

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
