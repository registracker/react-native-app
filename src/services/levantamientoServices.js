/* eslint-disable prettier/prettier */
import { instance } from '../config/axios';

const getLevantamientoMarcador = async codigo => {
  try {
    const { data, status } = await instance(`/api/levantamientos/${codigo}`);
    return {
      data: data.data,
      status,
    };
  } catch (error) {
    return {
      data: [],
      status: 400,
    };
  }
};

const getLevantamientoContador = async codigo => {
  try {
    const { data, status } = await instance(`/api/conteo-vehicular/${codigo}`);
    return {
      data: data.data,
      status,
    };
  } catch (error) {
    return {
      data: [],
      status: 400,
    };
  }
};

module.exports = {
  getLevantamientoMarcador,
  getLevantamientoContador,
};
