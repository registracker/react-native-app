import {instance} from '../config/axios';

const getVehiculos = async () => {
  const response = await instance('/api/vehiculos');
  const {data} = response.data;
  return data;
};

const enviarReporte = async datos => {
  const response = await instance(
    '/api/reporte-contador/batch',
    null,
    'post',
    datos,
  );
  console.log(
    '🚀 ~ file: vehiculos.js:11 ~ enviarReporte ~ response:',
    response,
  );
  return response;
};

module.exports = {
  getVehiculos,
  enviarReporte,
};
