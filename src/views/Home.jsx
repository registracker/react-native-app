import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'
import { styles } from '../styles/style'
import { Button } from '@rneui/themed';

export const Home = ({navigation}) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/loginBackground.jpg')} resizeMode="cover" style={styles.imageBackground}>

            <View style={ styles.body }>
                <Image
                    style={{...styles.image , width: '80%', height: '80%'}}
                    source={require('../img/travel/transporte(6).png')} />
                    <Text style={styles.titleText}>Desplazamientos APP</Text>
            </View>
            <View style={
                styles.foobar
            }>
                <Button
                    title="Iniciar sesión"
                    buttonStyle={styles.buttonPrimary}
                    radius="lg"
                    containerStyle={styles.buttonContainer}
                    onPress={ () => navigation.navigate('Login')}
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
