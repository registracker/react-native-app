import {http_axios} from '../config/axios';

export const register = async (params, data) =>
  await http_axios('/api/usuario', params, 'post', data);