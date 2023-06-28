/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instance } from '../config/axios';
import { actualizarMarcador, storeReporteMarcador } from '../database/TblReporteMarcador';
import { showToast } from '../utils/toast';

const getMarcadores = async () => {
  try {
    const response = await instance('/api/marcadores');
    const { data, status } = response.data;

    return data;
  } catch (error) {
    return [];
  }

};

const postReporteMarcador = async (datos, manual = false) => {
    const opcionMarcador = await AsyncStorage.getItem('opcion-marcador');
    if (manual || opcionMarcador === 'activo') {
      const { data, status } = await instance(
        '/api/reporte-marcadores',
        null,
        'post',
        datos,
      );
      if (manual) {
          await actualizarMarcador(datos.id);
          showToast('Marcador sincronizado');
      } else if (status === 201 ){
        await storeReporteMarcador({ ...datos, enviado: 1 });
        showToast('Marcador registrado');
      }
      return data;
    } else {
      await storeReporteMarcador({ ...datos, enviado: 0 });
      showToast('Reporte de marcador almacenado temporalmente en el dispositivo')
    }
};

const getMisMarcadores = async () => {
  try {
    const params = {
      params: {
        personal: 'yes'
      }
    }
    const { data, status } = await instance('/api/levantamientos', params);
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



module.exports = {
  getMarcadores,
  postReporteMarcador,
  getMisMarcadores,
};
