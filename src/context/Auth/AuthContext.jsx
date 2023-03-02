import React, { useEffect, useReducer } from 'react'
import { createContext } from 'react';
import { http_axios } from '../../config/axios';
import { authReducer } from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

export const authInitialState = {
    autenticado: 'verificar',
    usuario: undefined,
    token: undefined,
    mensajeError: ''
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [authState, dispatch] = useReducer(authReducer, authInitialState);


    const signIn = async (params) => {

        try {
            const response = await http_axios('/api/sanctum/token', params, 'post');
            const token = response?.token;
            if (token){
                dispatch({ type: 'signIn', payload: { token } });
                await AsyncStorage.setItem('token', token)
            }

        } catch (error) {
            dispatch({
                type: 'error', payload: {
                    mensaje: error.data?.message || 'Credenciales incorrectas'
                }
            });
            
        }
    }

    const logout = async() => {
        try {
            await http_axios('api/token', null, 'delete', null)
            await AsyncStorage.multiRemove(['email', 'username', 'token'])
            dispatch({ type: 'logout' });
        } catch (error) {
            ToastAndroid.showWithGravity(
                'Lo sentimos, algo salio mal.',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }


    }

    const cleanError = () => {
        dispatch({ type: 'cleanError' })
    }

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            if (!token) return dispatch({ type: 'logout' })
            dispatch({ type: 'signIn', payload: { token } })

        } catch (error) {
            console.error(error);
            ToastAndroid.showWithGravity(
                'Sin autenticacion',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
    }

    useEffect(() => {
        getToken()

    }, [])



    return (
        <AuthContext.Provider value={{
            ...authState,
            signIn,
            logout,
            cleanError,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
