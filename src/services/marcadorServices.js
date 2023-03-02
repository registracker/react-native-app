import {http_axios} from '../config/axios';

const getMarcadores = async () => await http_axios('/api/marcadores');

module.exports = {
  getMarcadores,
};
