/* eslint-disable prettier/prettier */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { showToast } from '../utils/toast';

export const instance = async (url, params = {}, method = 'get', data = {}) => {
  const baseURL = API_URL || 'http://localhost:8100';
  console.log('🚀 *** file: axios.js:89 ~ instance ~ baseURL:', baseURL + url);

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
        showToast('BAD REQUEST. STATUS: 400')
        break;
      case 401:
        showToast('UNAUTHORIZED. STATUS: 401')
        break;
      case 403:
        showToast('FORBIDDEN. STATUS: 403')
        break;
      case 404:
        showToast('NOT FOUND. STATUS: 404')
        break;
      case 500:
        showToast('SERVER ERROR. STATUS: 500')
        break;
      case 503:
        showToast('SERVICE UNAVAILABLE. STATUS: 503')
        break;
      default:
        console.log(error);
        break;
    }
    console.log('🚀 ~ file: axios.js:117 ~ instance ~ error.response.:', JSON.stringify(error));

  }
};
