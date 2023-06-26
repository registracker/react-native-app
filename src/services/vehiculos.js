import {instance} from '../config/axios';

const getVehiculos = async () => {
  const response = await instance('/api/vehiculos');
  const {data} = response.data;
  return data;
};

const enviarReporte = async datos => {

  const body = {
    resources: datos
  }
  console.log("🚀 ~ file: vehiculos.js:14 ~ enviarReporte ~ body:", body)
  // console.log("🚀 ~ file: vehiculos.js:14 ~ enviarReporte ~ body:", body)

  const response = await instance(
    '/api/reporte-contador/batch',
    null,
    'post',
    body,
  );
  return response;
};

module.exports = {
  getVehiculos,
  enviarReporte,
};
