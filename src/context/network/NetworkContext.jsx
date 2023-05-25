
import { View, Text } from 'react-native'
import React from 'react'
import { createContext } from 'react'
import { useReducer } from 'react'
import { networkReducer } from './networkReducer'

export const NetworkContext = createContext()

const networkInicial = {
    isConnected: false,
    type: undefined,
    isWifiEnabled: undefined,
}

export const NetworkProvider = ({ children }) => {

    const [networkState, dispatch] = useReducer(networkReducer, networkInicial)

    const saveStatus = (status) => {
        dispatch({ type: 'status', payload: { isConnected: status.isConnected, isWifiEnabled: status.isWifiEnabled, type: status.type } })
    }


    return (
        <NetworkContext.Provider value={{
            ...networkState,
            saveStatus,
        }}>
            {children}
        </NetworkContext.Provider>

    )
}
