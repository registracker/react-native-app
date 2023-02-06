// In App.js in a new project
import React, { useContext, useEffect, useState } from 'react';
import { Permisos } from './Permisos';
import { Loading } from '../components/Loading';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { PermissionContext } from '../context/Permission/PermissionContext';
import { createTable } from '../config/database';
import { Login } from './Login'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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


export const Home = () => {

    useEffect(() => {
        createTable('tbl_recorrido');
    }, []);
    

    
return (
    <View>
        <Text>Hola Mundo</Text>
    </View>

);
}

