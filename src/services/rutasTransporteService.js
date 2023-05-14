import {http_axios, instance} from '../config/axios';

const getRutasTransporte = async () => {
  const response = await http_axios('/api/rutas-transporte');
  const {data} = response.data;
  return data;
};

const postBuscarRutasTransporte = async (dato = {}, page) => {
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

const postBuscarRutasTransporteInstance = async (dato, page) => {
  const {data} = await instance(
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

  if (data.data === undefined) {
    await postBuscarRutasTransporteInstance(dato, page)
  }

  return {data: data.data, links: data.links};
};

module.exports = {
  getRutasTransporte,
  postBuscarRutasTransporte,
  postBuscarRutasTransporteInstance,
};
