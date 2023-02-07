import React from 'react'
import { Image, Text, View } from 'react-native'
import { styles } from '../styles/style'
import { Button } from '@rneui/themed';

export const Home = () => {
    return (
        <View style={styles.container}>
            <View style={{
                ...styles.body,
            }}>
                <Image
                    style={{...styles.image , width: '80%', height: '80%'}}
                    source={require('../img/travel/transporte(6).png')} />
                    <Text style={styles.titleText}>Seguimiento APP</Text>
            </View>
            <View style={
                styles.foobar
            }>
                <Button
                    title="Iniciar sesión"
                    buttonStyle={{
                        backgroundColor: 'rgb(115, 102, 255)',
                        borderRadius: 3,
                    }}
                    radius="lg"
                    containerStyle={{
                        width: '80%',
                        marginHorizontal: 50,
                        marginVertical: 10,
                    }}
                />
                <Button
                    title="Registrarse"
                    buttonStyle={{
                        backgroundColor: 'rgb(100, 33, 92)',
                        borderRadius: 3,
                    }}
                    radius="lg"
                    containerStyle={{
                        width: '80%',
                        marginHorizontal: 50,
                        marginVertical: 10,
                    }}
                />
            </View>
        </View>
    )
}
