import {http_axios} from '../config/axios';

const getMarcadores = async () => await http_axios.get('/api/marcadores');

export default {
  getMarcadores,
};
