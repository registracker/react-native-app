import {http_axios, instance} from '../config/axios';

export const register = async data =>
  await instance('/api/usuario', {}, 'post', data);

export const account = async (params, data) =>
  await instance('/api/user', params, 'get', data);

export const getRoles = async () => {
  const response = await instance('/api/roles');
  const {data} = response.data;
  data.shift();
  return data
}
