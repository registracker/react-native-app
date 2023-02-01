// In App.js in a new project
import React, { useContext, useEffect } from 'react';
import { Permission } from './Permission';
import { Loading } from '../components/Loading';
import { Text, View } from 'react-native';
import { PermissionContext } from '../context/Permission/PermissionContext';
import { createTable } from '../config/database';
import {Login} from './Login'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const Home = () => {

    const { permissions, checkLocationPermission } = useContext(PermissionContext);

    useEffect(() => {
        createTable('tbl_recorrido');
        checkLocationPermission();
        console.log("Use Effect")
    }, []);

    // console.log("🚀 ~ file: Home.jsx:14 ~ Home ~ permissions", permissions)

    if (permissions.locationStatus === 'unavailable') {
        return <Loading />;
    }
    
    console.log("🚀 ~ file: Home.jsx:31 ~ Home ~ permissions.locationStatus", permissions.locationStatus)
    return (
        <Stack.Navigator
        >

            {
                (permissions.locationStatus === 'granted')
                    ? <Stack.Screen name='Home' component={Home} />
                    : <Stack.Screen name="Permission" component={Permission} />
            }

        </Stack.Navigator>
    );
}


