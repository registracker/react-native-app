import React, { useContext, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../views/Home';
import { PermissionContext } from '../context/permissions/PermissionContext';
import { Permisos } from '../views/Permisos';
import { Login } from '../views/Login';
import { FormularioRegistro } from '../views/FormularioRegistro';
import { TabNavegacion } from './TabNavegacion';
import { AuthContext } from '../context/authentication/AuthContext';
import { ListadoDesplazamiento } from '../views/ListadoDesplazamiento';
import { primary } from '../styles/style';
import { ListadoIncidentes } from '../views/ListadoIncidentes';
import { ListadoMarcadores } from '../views/ListadoMarcadores';
import CostoDesplazamientos from '../views/CostoDesplazamientos';
import ListadoRutaTransporte from '../views/ListadoRutaTransporte';
import Marcador from '../views/Marcador';
import { createTables, limpiarRegistros } from '../utils/functions';

import NetInfo from "@react-native-community/netinfo";

import { NetworkContext } from '../context/network/NetworkContext';
import ListadoVehiculo from '../views/ListadoVehiculo';
import ListadoContador from '../views/ListadoContador';
import { PermisosBackground } from '../views/PermisosBackground';
import { Proximamente } from '../views/Proximamente';
import { TerminosCondiciones } from '../views/TerminosCondiciones';
import Contador from '../views/Contador';
import { MisMarcadores } from '../views/Marcador/MisMarcadores';
import { ForgotPassword } from '../views/Auth/ForgotPassword';



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
}

const optionsView = {
    headerMode: 'float',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: primary,
        elevation: 0,
    },
    headerBackAccessibilityLabel: 'Atrás',
    headerBackTitle: 'Atrás',
    headerBackTitleVisible: false,
    headerShown: true,
    headerTitleStyle: {
        fontSize: 22
    }
}


export const Navigation = () => {

    const { permissions, checkLocationPermission } = useContext(PermissionContext);
    const { autenticado } = useContext(AuthContext);
    const { saveStatus } = useContext(NetworkContext)

    useEffect(() => {
        checkLocationPermission()
        createTables()
        limpiarRegistros()      //Limpia tabla de reportes de Desplazamiento, incidentes y marcadores 

        const unsubscribe = NetInfo.addEventListener(state => saveStatus(state));

        return () => {
            unsubscribe();
        }
    }, [])


    return (
        <Stack.Navigator
            screenOptions={options}
        >
            <Stack.Group >

                {
                    (permissions.locationStatus === 'granted' && permissions.locationBackground === 'granted') ?
                        <Stack.Group >
                            {
                                (autenticado === 'autenticado') ?
                                    <Stack.Group >
                                        <Stack.Screen name='TabNavegacion' component={TabNavegacion} />
                                        <Stack.Screen name='ListadoDesplazamiento' component={ListadoDesplazamiento} options={{
                                            title: 'Listado de desplazamientos',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='ListadoIncidentes' component={ListadoIncidentes} options={{
                                            title: 'Listado de incidentes',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='ListadoMarcadores' component={ListadoMarcadores} options={{
                                            title: 'Listado de marcadores',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='CostosDesplazamiento' component={CostoDesplazamientos} options={{
                                            title: 'Costos',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='ListadoRutaTransporte' component={ListadoRutaTransporte} options={{
                                            title: 'Listado de ruta de transporte',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='Marcador' component={Marcador} options={{
                                            title: 'Registrar marcador',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='ListadoVehiculo' component={ListadoVehiculo} options={{
                                            title: 'Listado de vehículos',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='Contador' component={Contador} options={{
                                            title: 'Contador vehicular',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='ListadoContador' component={ListadoContador} options={{
                                            title: 'Conteo vehicular',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='MisMarcadores' component={MisMarcadores} options={{
                                            title: 'Levantamientos',
                                            ...optionsView
                                        }} />
                                        <Stack.Screen name='Proximamente' component={Proximamente} options={{
                                            title: 'Próximamente',
                                            ...optionsView
                                        }} />
                                    </Stack.Group>
                                    :
                                    <Stack.Group >

                                        <Stack.Screen name='Home' component={Home} />
                                        <Stack.Screen name='Login' component={Login} />
                                        <Stack.Screen name='FormularioRegistro' component={FormularioRegistro} />
                                        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
                                    </Stack.Group>
                            }
                        </Stack.Group>
                        :
                        <Stack.Group >
                            {
                                (permissions.locationStatus === 'granted') ?
                                    <Stack.Screen name='PermisosBackground' component={PermisosBackground} />
                                    :
                                    <Stack.Screen name="Permission" component={Permisos} />
                            }
                        </Stack.Group>
                }
                <Stack.Screen name="TerminosCondiciones" component={TerminosCondiciones} />

            </Stack.Group>
        </Stack.Navigator >
    )
}