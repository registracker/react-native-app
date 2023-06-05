import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { styles } from '../styles/style'
import { Image } from '@rneui/base'

export const Proximamente = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../img/fondo.png')}
                resizeMode="cover"
                style={styles.imageBackground}
            >

            <View style={styles.body}>
                    <Image
                        style={{ ...styles.image, width:250, height:250 }}
                        source={require('../img/proximamente/computer.png')} />
                    
                    <Text style={{ ...styles.titleText, marginBottom: 50, }}>Próximamente...</Text>
            </View>
            </ImageBackground>
        </View>
    )
}

