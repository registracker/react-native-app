import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Loading } from './Loading';

import { getMediosDesplazamientos } from '../services/mediosDesplazamientoServices'
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from '../styles/style';


export const MediosDesplazamientosComponentes = ({ selected, cambiarMedio }) => {


    const [mediosDesplazamientos, setMediosDesplazamientos] = useState()

    useEffect(() => {
        created()
    }, [])

    const created = async () => {
        const { data } = await getMediosDesplazamientos();
        setMediosDesplazamientos(data)
    }

    if (!mediosDesplazamientos) return <Loading />


    return (
        <View style={{
            flexDirection: 'row',
        }}>
            <ScrollView
                horizontal
            >
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
                                <TouchableOpacity
                                    onPress={() => cambiarMedio({id:medio.id, nombre:medio.nombre, icono: medio.icono})}
                                    style={selected.id === medio.id ? styles.roundButtonDesplazamientoSelected : styles.roundButtonDesplazamiento }
                                    >
                                    <Text style={{fontSize:25}}>{medio.icono}</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 12 }}>
                                    {medio.nombre}
                                </Text>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}
