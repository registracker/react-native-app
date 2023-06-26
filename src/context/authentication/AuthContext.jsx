import React, {useEffect, useReducer} from 'react';
import {createContext} from 'react';
import {instance} from '../../config/axios';
import {authReducer} from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';
import {deleteReporteIncidentes} from '../../database/TblIncidentes';
import {removeDesplazamientos} from '../../database/TblDesplazamientos';
import {removeReporteMarcador} from '../../database/TblReporteMarcador';
import {clearLocalStorage, limpiarCatalogos} from '../../utils/functions';
import {account} from '../../services/aurtenticacionServices';
import axios from 'axios';

import {headers, baseURL} from '../../config/axios';
import {useContext} from 'react';
import {NetworkContext} from '../network/NetworkContext';

export const authInitialState = {
  autenticado: 'verificar',
  usuario: undefined,
  token: undefined,
  mensajeError: '',
};

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const {isConnected} = useContext(NetworkContext);

  const signIn = async params => {
    try {
      const response = await instance('/api/sanctum/token', params, 'post');
      const token = response.data?.token;

      if (token) {
        dispatch({type: 'signIn', payload: {token}});
        await AsyncStorage.setItem('token', token);
        return true;
      }
      return false;
    } catch (error) {
      if (error.response.status === 422) {
        dispatch({
          type: 'error',
          payload: {
            mensaje: error.response.data.message,
          },
        });
      } else {
        dispatch({
          type: 'error',
          payload: {
            mensaje: 'Credenciales incorrectas. correo o contraseña invalidas',
          },
        });
      }
      dispatch({type: 'logout'});
      await AsyncStorage.removeItem('token');
      return true;
    }
  };

  const logout = async () => {
    try {
      await instance('/api/token', null, 'delete', null);
      await deleteReporteIncidentes();
      await removeReporteMarcador();
      await removeDesplazamientos();
      await limpiarCatalogos();
      await clearLocalStorage();
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Token expirado',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      await AsyncStorage.removeItem('token');
      dispatch({type: 'logout'});
    }
  };

  const cleanError = () => {
    dispatch({type: 'cleanError'});
  };

  const verificarToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return dispatch({type: 'logout'});
    if (isConnected) {
      headers.Authorization = `Bearer ${token}`;
      const intance = await axios.create({
        baseURL,
        headers,
      });
      const {data, status} = await intance.get('/api/user');
      if (status === 200) {
        const {usuario} = data;
        dispatch({type: 'signIn', payload: {token, usuario}});
      }
    } else {
      await logout();
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return dispatch({type: 'logout'});

      if (isConnected) {
        await verificarToken();
      } else {
        dispatch({type: 'signIn', payload: {token}});
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Sin autenticación',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        logout,
        cleanError,
        verificarToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
