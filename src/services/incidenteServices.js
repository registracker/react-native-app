/* eslint-disable prettier/prettier */
import { http_axios, instance } from '../config/axios';

const getIncidentes = async() => {
  const response = await instance('/api/incidentes');
  const { data } = response.data;
  return data
}

const postIncidente = async data => {
  await instance('/api/reporte-incidente', null, 'post', data);
};

module.exports = {
  getIncidentes,
  postIncidente,
};
