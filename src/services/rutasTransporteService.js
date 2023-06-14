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
      null,
    );
    const {data, links} = response.data;
    return {data, links};
  } catch (e) {
    console.error(e);
  } finally {
  }
};

const postBuscarRutasTransporteInstance = async (dato, page) => {
  const params = {
    limit: 1000,
  };
  const body = {

    search: {
      value: dato,
      case_insensitive: false,
    },
    filters: [
      {
        field: 'departamento.id',
        operator: '=',
        value: 6,
      },
    ],
  };
  const {data} = await instance(
    `/api/rutas-transporte/search${page ? `?${page}` : ''}`,
    params,
    'post',
    body
  );

  if (data === undefined) {
    await postBuscarRutasTransporteInstance(dato, page);
  }

  return {data: data.data, links: data.links};
};

module.exports = {
  getRutasTransporte,
  postBuscarRutasTransporte,
  postBuscarRutasTransporteInstance,
};
