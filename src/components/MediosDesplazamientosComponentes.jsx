import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { Loading } from './Loading';

import { styles } from '../styles/style';
import { Icon } from '@rneui/base';


export const MediosDesplazamientosComponentes = ({ selected, cambiarMedio, mediosDesplazamientos }) => {

    if (!mediosDesplazamientos) return <Loading />


    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingHorizontal:'10%'

        }}>
                {
                    mediosDesplazamientos.map(medio => {
                        return (
                            <View
                                key={medio.id}
                                style={{
                                    margin: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Icon
                                    onPress={() => cambiarMedio(medio)}
                                    style={selected.id === medio.id ? styles.roundButtonDesplazamientoSelected : styles.roundButtonDesplazamiento}
                                    raised
                                    name={medio.icono}
                                    type='material-community'
                                    color={selected.id === medio.id ? styles.primary : 'black'}
                                />

                                <Text style={{ fontSize: 12, color:'black' }}>
                                    {medio.nombre}
                                </Text>
                            </View>
                        )
                    })
                }
        </View>
    )
}
