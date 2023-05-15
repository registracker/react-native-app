import { Text, StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { Component } from 'react'
import { primary, styles } from '../styles/style'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'

const menu = [
    {
        toGo: 'ListadoDesplazamiento',
        icon: 'map-check-outline',
        title: 'Desplazamientos'
    },
    {
        toGo: 'ListadoIncidentes',
        icon: 'car-cog',
        title: 'Incidentes'
    },
    {
        toGo: 'ListadoMarcadores',
        icon: 'traffic-light',
        title: 'Marcadores'
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
                                size={26}
                            />
                                <Text style={styles.text}>{item.title}</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        margin: 10,
        width: '90%',
        height: '10%',
        backgroundColor: primary
    },
    cardText: {
        color: 'white',

    },
    cardIcon: {

    }
})
