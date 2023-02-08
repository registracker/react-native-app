import axios from 'axios';
import {API_URL} from '@env';

export const http_axios = async (url, params, method) => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return new Promise((resolve, reject) => {
    instance
      .post(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => reject(err));
  });
};
