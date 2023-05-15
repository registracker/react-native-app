/* eslint-disable prettier/prettier */
import { http_axios } from '../config/axios';

const getLevantamiento = async codigo => {
  try {
    const { data, status } = await http_axios(`/api/levantamientos/${codigo}`);
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
  getLevantamiento,
};
