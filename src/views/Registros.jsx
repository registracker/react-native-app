import { Text, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from 'react-native'
import React from 'react'
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
    {
        toGo: 'ListadoContador',
        icon: 'car-3-plus',
        title: 'Contedor Vehicular'
    },
]


export const Registros = () => {

    const navigation = useNavigation();

    const Item = ({ item }) => (
        <TouchableOpacity
            key={item.toGo}
            style={stylesRegistros.card}
            onPress={() => navigation.navigate(item.toGo)}
        >

            <Icon
                name={item.icon}
                type='material-community'
                color='white'
                size={40}
            />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

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
            <FlatList
                data={menu}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item.toGo}
            />
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
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        margin: 10,
        backgroundColor: primary
    },
    cardText: {
        color: 'white',

    },
    cardIcon: {

    }
})
