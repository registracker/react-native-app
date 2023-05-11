import {http_axios} from '../config/axios';

const getRutasTransporte = async () => {
  const response = await http_axios('/api/rutas-transporte');
  const {data} = response.data;
  return data;
};

const postBuscarRutasTransporte = async dato => {
  const buscar = {
    search: {
      value: dato,
      case_insensitive: false,
    },
  };
  const response = await http_axios(
    '/api/rutas-transporte/search',
    null,
    'post',
    buscar,
  );
  const {data} = response.data;
  const {links} = response;

  return {data, links};
};

module.exports = {
  getRutasTransporte,
  postBuscarRutasTransporte,
};
