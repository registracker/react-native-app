import { Text, StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { Component } from 'react'
import { primary } from '../styles/style'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'

const menu = [
    {
        toGo: 'ListadoDesplazamiento',
        icon: 'map-check-outline',
        title: 'desplazamientos'
    },
    {
        toGo: 'ListadoIncidentes',
        icon: 'car-cog',
        title: 'incidentes'
    },
    {
        toGo: 'ListadoMarcadores',
        icon: 'traffic-light',
        title: 'marcadores'
    },
]


export const Registros = () => {

    const navigation = useNavigation();


    return (
        <ImageBackground
            source={require('../img/fondo.png')}
            resizeMode="cover"
            style={{
                flex: 1,
                justifyContent: 'center',
                tintColor: 'transparent'
            }}
        >
            <View style={stylesRegistros.body}>

                {
                    menu.map(item => (
                        <TouchableOpacity
                            key={item.toGo}
                            style={stylesRegistros.card}
                            onPress={() => navigation.navigate(item.toGo)}
                        >
                            <Icon
                                name={item.icon}
                                type='material-community'
                                color='white'
                                size={20}
                            />
                            <View>
                                <Text style={stylesRegistros.cardText}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>

                    ))
                }

            </View>
        </ImageBackground>
    )
}

const stylesRegistros = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card: {
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 5,
        margin: 10,
        width: 140,
        height: 80,
        backgroundColor: primary
    },
    cardText: {
        color: 'white',

    },
    cardIcon: {

    }
})
