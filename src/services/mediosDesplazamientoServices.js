/* eslint-disable prettier/prettier */
import {instance} from '../config/axios';

const getMediosDesplazamientos = async () => {
  const response = await instance('/api/medios-desplazamiento');
  const {data} = response.data;
  return data;
};

module.exports = {
  getMediosDesplazamientos,
};
