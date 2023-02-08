import React, { useReducer } from 'react'
import {Children, createContext} from 'react';
import { authReducer } from './authReducer';

export const authInitialState = {
  isLogginIn: false,
  username: undefined,
  token: undefined,
};

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {

    const [authState, dispatch] = useReducer(authReducer, authInitialState);


    const signIn = async (data) => {
        dispatch({ type: 'signIn', payload: data});
    }

    // const changeFavoriteIcon = (iconName: string) => {
    //     dispatch({ type: 'changeFavIcon', payload: iconName })
    // }

    const logout = () => {
        dispatch({ type: 'logout' });
    }

    // const changeUsername = (username: string) => {
    //     dispatch({ type: 'changeUsername', payload: username })
    // }


    return (
        <AuthContext.Provider value={{
            authState,
            signIn,
            logout,
            // changeFavoriteIcon,
            // changeUsername
        }}>
            {children}
        </AuthContext.Provider>
    )
}
