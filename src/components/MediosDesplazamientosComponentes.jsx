import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Loading } from './Loading';

import { getMediosDesplazamientos } from '../services/mediosDesplazamientoServices'
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
                                <TouchableOpacity
                                    onPress={() => cambiarMedio({id:medio.id, nombre:medio.nombre, icono: medio.icono})}
                                    style={selected.id === medio.id ? styles.roundButtonDesplazamientoSelected : styles.roundButtonDesplazamiento }
                                    >
                                    <Text style={{fontSize:25, color:'white'}}>{medio.icono}</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 12, color:'white' }}>
                                    {medio.nombre}
                                </Text>
                            </View>
                        )
                    })
                }
        </View>
    )
}
