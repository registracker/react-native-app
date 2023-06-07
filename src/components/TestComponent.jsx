import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '../styles/style'
import { Image } from '@rneui/base'

const Proximamente = () => {
    return (
        <View>
            <View style={styles.body}>
                <Image
                    style={{ ...styles.image, width: '50%', height: '50%' }}
                    source={require('../img/permiso/smartphone.png')} />
                <Text style={{ ...styles.titleText, marginBottom: 50 }}>PRÓXIMAMENTE</Text>
            </View>
        </View>
    )
}

export default Proximamente