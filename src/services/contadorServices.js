import {instance} from '../config/axios';

export const getMisContadores = async () => {
  try {
    const {data, status} = await instance('/api/conteo-vehicular');
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
