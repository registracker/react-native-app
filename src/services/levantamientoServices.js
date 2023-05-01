import {http_axios} from '../config/axios';

const getLevantamiento = async codigo => {
  try {
    const {data, status} = await http_axios(`/api/levantamientos/${codigo}`);
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

const postLevantamiento = async datos => {
  try {
    const {data, status} = await http_axios(
      '/api/reporte-marcadores',
      null,
      'post',
      datos,
    );
    return {data, status};
  } catch (error) {
    return false;
  }
};

module.exports = {
  getLevantamiento,
  postLevantamiento,
};
