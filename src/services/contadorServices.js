import {instance} from '../config/axios';

export const getMisContadores = async () => {
  try {
    const params = {
      personal: 'yes',
    };
    const {data, status} = await instance('/api/conteo-vehicular', params);
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
