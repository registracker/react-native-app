import React, { useContext, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../views/Home';
import { PermissionContext } from '../context/Permission/PermissionContext';
import { Permisos } from '../views/Permisos';
import { Login } from '../views/Login';
import { FormularioRegistro } from '../views/FormularioRegistro';
import { TabNavegacion } from './TabNavegacion';
import { AuthContext } from '../context/authentication/AuthContext';

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
    const { autenticado } = useContext(AuthContext);

    useEffect(() => {
        checkLocationPermission()
    }, [])


    return (
        <Stack.Navigator
            screenOptions={options}
        >

            {
                (permissions.locationStatus === 'granted')
                    ? <Stack.Group >
                        {
                            (autenticado === 'autenticado')
                                ? <Stack.Group >
                                    <Stack.Screen name='TabNavegacion' component={TabNavegacion} />
                                </Stack.Group>
                                : <Stack.Group >
                                    <Stack.Screen name='Home' component={Home} />
                                    <Stack.Screen name='Login' component={Login} />
                                    <Stack.Screen name='FormularioRegistro' component={FormularioRegistro} />
                                </Stack.Group>
                        }

                    </Stack.Group>


                    : <Stack.Screen name="Permission" component={Permisos} />
            }
        </Stack.Navigator>
    )
}