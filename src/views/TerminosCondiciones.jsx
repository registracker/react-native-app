import { View, Text, ActivityIndicator, BackHandler } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getTerminosCondiciones } from '../services/terminosCondicionesServices'
import { ScrollView } from 'react-native-gesture-handler'
import { primary, styles } from '../styles/style'
import { Button } from '@rneui/base'

export const TerminosCondiciones = ({navigation}) => {

    const [terminos, setTerminos] = useState()
    const [loaderTerminos, setLoaderTerminos] = useState(true)


    const goBack = () => {
        if (navigation.canGoBack())
            navigation.goBack();
        else
            BackHandler.exitApp();
    }


    useEffect(() => {
        const obtenerTerminosCondiciones = async () => {
            const data = await getTerminosCondiciones();
            setTerminos(data.descripcion);
            setLoaderTerminos(false)
        }
        obtenerTerminosCondiciones()
    }, [])

    return (
        <View style={{ ...styles.centeredView, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', }}>Términos y Condiciones</Text>
            <ScrollView >
                {
                    loaderTerminos ?
                        <ActivityIndicator size={'large'} color={primary} />
                        :
                        <Text style={{
                            fontSize: 12,
                            textAlign: 'justify',
                            color: 'black',
                            textTransform: 'uppercase'
                        }}>{terminos}.</Text>

                }
            </ScrollView>
            <View style={{
                flex: 0.5,
                justifyContent: 'center',
                alignContent: 'center',
            }}>
                <Button title="Volver" type="clear" titleStyle={{ color: primary }} onPress={() =>goBack()} />
            </View>
        </View>
    )
}

