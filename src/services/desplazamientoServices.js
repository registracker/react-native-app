/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instance } from '../config/axios';
import { addItemDesplazamiento, sendDesplazamiento } from '../database/TblDesplazamientos';
import { showToast } from '../utils/toast';

const postDesplazamiento = async (datos, manual = false) => {
  const optionDesplazamiento = await AsyncStorage.getItem(
    'opcion-desplazamiento',
  );
  if (optionDesplazamiento === 'activo' || manual) {
    const { data, status } = await instance(
      '/api/desplazamiento/registrar',
      null,
      'post',
      datos,
    );
    if (manual) {
      sendDesplazamiento(datos.uuid);
    } else if (status === 201 ) {
      await addItemDesplazamiento({ ...datos, enviado: 1 });
      showToast('Desplazamiento sincronizado')

      return data;
    }
  }
};

module.exports = {
  postDesplazamiento,
};
