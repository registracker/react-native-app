import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Desplazamiento } from '../views/Desplazamiento';
import { ListadoDesplazamiento } from '../views/ListadoDesplazamiento';
import { Ajustes } from '../views/Ajustes';
import { Icon } from '@rneui/base';
import { styles } from '../styles/style';

const Tab = createBottomTabNavigator();

export const TabNavegacion = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Desplazamiento"
                component={Desplazamiento}
                options={{
                    title: 'Desplazamiento',
                    tabBarLabelStyle: { fontSize: 14 },
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="map-marker-account" type='material-community' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    // tabBarBadge: ''
                    tabBarActiveTintColor: styles.primary
                }}
            />
            <Tab.Screen
                name="ListadoDesplazamiento"
                component={ListadoDesplazamiento}
                options={{
                    title: 'Mis desplazamientos',
                    tabBarLabelStyle: { fontSize: 14 },
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="map-search-outline" type='material-community' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarActiveTintColor: styles.primary,
                    // tabBarBadge: ''
                }}
            />
            <Tab.Screen
                name="Ajustes"
                component={Ajustes}
                options={{
                    title: 'Ajustes',
                    tabBarLabelStyle: { fontSize: 14 },
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
