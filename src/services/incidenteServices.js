/* eslint-disable prettier/prettier */
import { instance } from '../config/axios';

const getIncidentes = async() => {
  const response = await instance('/api/incidentes');
  const { data } = response.data;
  return data
}

const postIncidente = async datos => {
  const {data, status}  = await instance('/api/reporte-incidente', null, 'post', datos);
  return { data, status}
};

module.exports = {
  getIncidentes,
  postIncidente,
};
