/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instance } from '../config/axios';
import { addItemDesplazamiento, sendDesplazamiento } from '../database/TblDesplazamientos';

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
    }
    if (status === 201 && !manual) {
      await addItemDesplazamiento({ ...datos, enviado: 1 });
    }
    return data;
  } else {
    await addItemDesplazamiento(datos);
  }
};

module.exports = {
  postDesplazamiento,
};
