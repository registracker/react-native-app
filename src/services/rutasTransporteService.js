import {http_axios} from '../config/axios';

const getRutasTransporte = async () => {
  const response = await http_axios('/api/rutas-transporte');
  const {data} = response.data;

  return data;
};

const postBuscarRutasTransporte = async datos => {
  const response = await http_axios(
    '/api/rutas-transporte/search',
    null,
    'post',
    datos,
  );
  const {data} = response.data;
  return data;
};

module.exports = {
  getRutasTransporte,
  postBuscarRutasTransporte,
};
