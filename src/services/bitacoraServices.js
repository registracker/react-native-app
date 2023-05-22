import {instance} from '../config/axios';

export const getBitacota = async () => {
  const response = await instance('/api/bitacora-tablas');
  const {data} = response.data;
  return data;
};
