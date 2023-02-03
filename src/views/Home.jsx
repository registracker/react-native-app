// In App.js in a new project
import React, { useContext, useEffect, useState } from 'react';
import { Permission } from './Permisos';
import { Loading } from '../components/Loading';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { PermissionContext } from '../context/Permission/PermissionContext';
import { createTable } from '../config/database';
import { Login } from './Login'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export const Home = ({ navigation }) => {

    useEffect(() => {
        createTable('tbl_recorrido');
    }, []);


return (
    <View>
        <Text>Bienvenido a MyDesplazamiento</Text>
        <Text>Espero que te encuentres bien hoy</Text>
        <Image
            style={styles.tinyLogo}
            source={require(`../img/travel/transporte(6).png`)}
        />

        <Button
            title='Iniciar sesión'
            onPress={() => navigation.navigate('Login')}
            color='#0b1d51'
        />
        <Button
            title='Registrarse'
            onPress={() => navigation.navigate('Permisos')}
            color='#d56f3e'
        />
    </View>

);
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
    },
    tinyLogo: {
        width: 400,
        height: 400,
    },
    logo: {
        width: 66,
        height: 58,
    },
});

