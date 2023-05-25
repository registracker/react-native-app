import React, { useContext } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { primary, styles } from '../styles/style';
import { Icon } from '@rneui/base';
import { Loading } from './Loading';
import { CatalogosContext } from '../context/store/CatalogosContext';


export const MediosDesplazamientosComponentes = ({ selected, cambiarMedio }) => {
    
    const { ctl_medios_desplazamientos } = useContext(CatalogosContext)
    
    if (!ctl_medios_desplazamientos.data) return <Loading />

    const renderItem = ({ item }) => {
        return (
            <View style={{
                margin: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: 100
            }}>
                <TouchableOpacity
                    onPress={() => cambiarMedio(item)}
                    style={selected.id === item.id ? styles.iconoSelected : styles.iconos}
                >
                    <Icon
                        name={item.icono}
                        type='material-community'
                        color={selected.id === item.id ? primary : 'grey'}
                        reverseColor={primary}
                        solid
                        size={selected.id === item.id ? 50 : 36}
                    />

                </TouchableOpacity>
                <Text adjustsFontSizeToFit style={styles.text}>
                    {item.nombre}
                </Text>
            </View>
        );
    };

    return (
        <FlatList
            data={ctl_medios_desplazamientos.data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns='3'
        />
    )
}
