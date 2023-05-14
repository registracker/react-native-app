/* eslint-disable prettier/prettier */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export const http_axios = async (url, params, method = 'get', data) => {
  const baseURL = API_URL || 'http://45.33.119.69:8100';
  console.log('🚀 ~~ ', method, baseURL + url);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    timeout: 10000,
  };

  const token = await AsyncStorage.getItem('token');

  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  const instance = axios.create({
    baseURL,
    headers,
  });

  return new Promise((resolve, reject) => {
    switch (method) {
      case 'get':
        return instance
          .get(url, params)
          .then(response => {
            resolve({ data: response.data, status: response.status, links: response.links });
          })
          .catch(err => {
            reject(err.response);
          });

      case 'post':
        return instance
          .post(url, { ...params, ...data })
          .then(response => {
            resolve({ data: response.data, status: response.status, links: response.links });
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });

      case 'put':
        return instance
          .put(url, { ...params, ...data })
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      case 'delete':
        return instance
          .delete(url, { ...params, ...data })
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      case 'patch':
        return instance
          .patch(url, { ...params, ...data })
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      default:
        break;
    }
  });
};


export const instance = async (url, params = {}, method = 'get', data = {}) => {
  const baseURL = API_URL || 'http://localhost:8100';
  console.log('🚀 ~ file: axios.js:89 ~ instance ~ baseURL:', baseURL + url);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    timeout: 1000,
  };

  // Set token in axios instance.
  const token = await AsyncStorage.getItem('token');
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  const instance = await axios.create({
    baseURL,
    headers,
  });

  try {
    const response = await instance[method](url, { ...params, ...data });
    return { data: response.data, status: response.status };
  } catch (error) {
    switch (error.response?.status) {
      case 400:
        console.log('BAD REQUEST');
        break;
      case 401:
        console.log('UNAUTHORIZED');
        break;
      case 403:
        console.log('FORBIDDEN');
        break;
      case 404:
        console.log('NOT FOUND');
        break;
      case 500:
        console.log('SERVER ERROR');
        break;
      case 503:
        console.log('SERVICE UNAVAILABLE');
        break;
      default:
        console.log(error);
        break;
    }
    console.log('🚀 ~ file: axios.js:117 ~ instance ~ error.response.:', error);

  }
};
