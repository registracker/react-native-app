import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const http_axios = (url, params, method = 'get') => {
  const baseURL = API_URL;
  let token = null;
  getToken().then(response => {
    token = response;
  });
  const instance = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  return new Promise((resolve, reject) => {
    switch (method) {
      case 'get':
        return instance
          .get(url, params)
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      case 'post':
        return instance
          .post(url, params)
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      case 'put':
        return instance
          .post(url, params)
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      case 'delete':
        return instance
          .post(url, params)
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err.response);
          });

      case 'patch':
        return instance
          .post(url, data, params)
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

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('🚀 ~ file: axios.js:58 ~ getToken ~ token', token);
  return token;
};
