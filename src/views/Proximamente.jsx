import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '../styles/style'

export const Proximamente = () => {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Image
                    style={{ ...styles.image, width: '100%', height: '100%' }}
                    source={require('../img/logo.png')} />
                <Text style={{ ...styles.titleText, marginBottom: 50 }}>Próximamente....</Text>
            </View>
        </View>
    )
}

