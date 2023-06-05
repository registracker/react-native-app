import React, { useEffect } from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'
import { styles } from '../styles/style'
import { Button } from '@rneui/themed';

export const Home = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/loginBackground.jpg')} resizeMode="cover" style={styles.imageBackground}>

                <View style={styles.body}>
                    <Image
                        style={{ ...styles.image, width: '100%', height: '100%' }}
                        source={require('../img/logo.png')} />
                    <Text style={{ ...styles.titleText, marginBottom: 50 }}>REGISTRACKER</Text>
                </View>
                <View style={
                    styles.foobar
                }>
                    <Button
                        title="Iniciar sesión"
                        buttonStyle={styles.buttonPrimary}
                        radius="lg"
                        containerStyle={styles.buttonContainer}
                        onPress={() => navigation.navigate('Login')}
                    />
                    <Button
                        title="Registrarse"
                        onPress={() => navigation.navigate('FormularioRegistro')}
                        buttonStyle={styles.buttonSecondary}
                        radius="lg"
                        containerStyle={styles.buttonContainer}
                    />
                </View>
            </ImageBackground>
        </View>
    )
}
