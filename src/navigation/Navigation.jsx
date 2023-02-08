import React, { useContext, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../views/Home';
import { MapPage } from '../views/MapPage';
import { Permission } from '../views/Permission';
import { PermissionContext } from '../context/Permission/PermissionContext';
import { Loading } from '../components/Loading';
import { Permisos } from '../views/Permisos';  
import { Login } from '../views/Login';  

const Stack = createNativeStackNavigator();

const options = {
    headerShown: false,
    headerMode: 'float',
    headerTintColor: 'black',
    headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
    },
    headerBackAccessibilityLabel: 'Atrás',
    headerBackTitle: 'Atrás',
    headerBackTitleVisible: false,

    //   cardOverlayEnabled: true
}

export const Navigation = () => {

    const { permissions, checkLocationPermission } = useContext(PermissionContext);

    useEffect(() => {
        checkLocationPermission()
    }, [])


    return (
        <Stack.Navigator
            screenOptions={options}
        >
                    {/* ? <Stack.Screen name='Menu' component={MenuLateral} /> */}
                    {/* ? <Stack.Screen name='Menu' component={MapPage} /> */}

            {
                (permissions.locationStatus === 'granted')
                    ? <Stack.Screen name='Home' component={Home} />
                    : <Stack.Screen name="Permission" component={Permisos} />
            }
            <Stack.Screen name='Login' component={Login} />
            {/* <Stack.Screen name='Login' component={Login} /> */}
        </Stack.Navigator>
    )
}