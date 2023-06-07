import {instance} from '../config/axios';

export const getTerminosCondiciones = async () => {
  const response = await instance('/api/terminos-condiciones/1');
  const {data} = response.data;
  return data;
};
