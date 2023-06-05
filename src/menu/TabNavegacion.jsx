import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Desplazamiento } from '../views/Desplazamiento';
import { Ajustes } from '../views/Ajustes';
import { Icon, Image } from '@rneui/base';
import { styles } from '../styles/style';
import { Registros } from '../views/Registros';
import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { NetworkContext } from '../context/network/NetworkContext';
import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext';
import Contador from '../views/Contador';
import { CatalogosContext } from '../context/store/CatalogosContext';
import { BitacoraContext } from '../context/bitacora/BitacoraContext';
import { MarcadorContext } from '../context/levantamiento/MarcadorContext';
import { IncidenteContext } from '../context/levantamiento/IncidenteContext';
import { getOptionEnvioAutomatico } from '../utils/functions';
import { Proximamente } from '../views/Proximamente';

const Tab = createBottomTabNavigator();

const options = {
    headerMode: 'float',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: styles.primary,
        elevation: 0,
    },
    headerBackAccessibilityLabel: 'Atrás',
    headerBackTitle: 'Atrás',
    headerBackTitleVisible: false,
    //   cardOverlayEnabled: true
    tabBarStyle: {
        backgroundColor: 'white',
    }
}

export const TabNavegacion = () => {

    const { getCatalogos } = useContext(CatalogosContext)
    const { obtenerBitacora } = useContext(BitacoraContext)

    const { sincronizarMarcadores } = useContext(MarcadorContext)
    const { sincronizarIncidentes } = useContext(IncidenteContext)
    const { isConnected } = useContext(NetworkContext)

    const { sincronizarReporteDesplazamiento } = useContext(DesplazamientoContext)

    const sincronizar = async () => {
        const respose = await Promise.all([
            sincronizarReporteDesplazamiento(),
            sincronizarMarcadores(),
            sincronizarIncidentes(),
            // envioAutomaticoDesplazamientos(),
            // getOptionEnvioAutomatico()

        ])

    }

    useEffect(() => {
        // console.log("🚀 ~ file: TabNavegacion.jsx:63 ~ useEffect ~ netInfo:", netInfo)
        if (isConnected === true) {
            // envioAutomaticoDesplazamientos()
            // sincronizar()
            sincronizar()
        }
        obtenerBitacora()
        getCatalogos()
    }, [])

    return (
        <Tab.Navigator screenOptions={options}>
            <Tab.Screen
                name="Desplazamiento"
                component={Desplazamiento}
                options={{
                    title: 'Desplazamiento',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="map-marker-account" type='material-community' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    // tabBarBadge: ''
                    tabBarActiveTintColor: styles.primary
                }}
            />
            <Tab.Screen
                name="Contador"
                component={Proximamente}
                // component={Contador}
                options={{
                    title: 'Contador vehicular',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="car-3-plus" type='material-community' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    // tabBarBadge: ''
                    tabBarActiveTintColor: styles.primary
                }}
            />
            <Tab.Screen
                name="Registros"
                component={Registros}
                options={{
                    title: 'Registros',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="map-search-outline" type='material-community' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarActiveTintColor: styles.primary
                    // tabBarBadge: ''
                }}
            />
            <Tab.Screen
                name="Ajustes"
                component={Ajustes}
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cog-outline" type='material-community' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarActiveTintColor: styles.primary


                }}
            />
        </Tab.Navigator>
    );
}
