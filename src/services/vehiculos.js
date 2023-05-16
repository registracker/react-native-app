import {instance} from '../config/axios';

const getVehiculos = async () => {
  const response = await instance('/api/vehiculos');
  const {data} = response.data;
  console.log("🚀 ~ file: vehiculos.js:6 ~ getVehiculos ~ data:", data)
  return data;
};

module.exports = {
  getVehiculos,
};
