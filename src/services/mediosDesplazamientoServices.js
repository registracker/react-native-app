/* eslint-disable prettier/prettier */
import {http_axios} from '../config/axios';

const getMediosDesplazamientos = async () => {
  const response = await http_axios('/api/medios-desplazamiento');
  const {data} = response.data;
  return data;
};

module.exports = {
  getMediosDesplazamientos,
};
