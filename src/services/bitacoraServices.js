import {instance} from '../config/axios';

export const getBitacota = async () => {
  const body = {
    sort: [{field: 'id', direction: 'asc'}],
  };
  const response = await instance(
    '/api/bitacora-tablas/search',
    null,
    'post',
    body,
  );
  const {data} = response.data;
  return data;
};
