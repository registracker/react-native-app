import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button, Input } from '@rneui/base'
import { styles } from '../styles/style'

import { postBuscarRutasTransporte } from '../services/rutasTransporteService.js';


export default function RutasTransporte() {

    const [buscar, setBuscar] = useState()


    const buscarRuta = async () => {
        const data = {
            "filters": [
                {
                    "field": 'ruta',
                    "operator": "like",
                    "value": buscar
                }
            ]
        }

        const response = await postBuscarRutasTransporte(data)

        setRutasTransporte(response)
    }


    return (
        <View>
            <Text>RutasTransporte</Text>
            <Input
                containerStyle={{ width: '80%', paddingBottom: 0 }}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} />}
                placeholder='Buscar...'
                onChangeText={setBuscar}
                value={buscar}
            />
            <Button
                title="Buscar"
                onPress={buscarRuta}
                buttonStyle={styles.buttonPrimary}
                disabledStyle={styles.buttonPrimaryDisabled}
                // loading={cargando}
                // disabled={!validLogin}
                radius="lg"
                containerStyle={styles.buttonContainer}
            />

        </View>
    )
}

// const styles = StyleSheet.create({})