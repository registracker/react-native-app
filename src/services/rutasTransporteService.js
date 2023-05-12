import {http_axios} from '../config/axios';

const getRutasTransporte = async () => {
  const response = await http_axios('/api/rutas-transporte');
  const {data} = response.data;
  return data;
};

const postBuscarRutasTransporte = async (dato, page) => {
  try {
    const response = await http_axios(
      `/api/rutas-transporte/search${page ? `?${page}` : ''}`,
      null,
      'post',
      {
        search: {
          value: dato,
          case_insensitive: false,
        },
      },
    );
    const {data, links} = response.data;
    return {data, links};
  } catch (e) {
    console.error(e);
  } finally {
  }
};

module.exports = {
  getRutasTransporte,
  postBuscarRutasTransporte,
};
