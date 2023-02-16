import { Icon } from '@rneui/base'
import React from 'react'
import { Text, View } from 'react-native'
import { styles } from '../styles/style'

export const Registrarse = () => {
    return (
        <View style={styles.container}>
            <View style={{
                ...styles.body,
                flex: 2,
                justifyContent: 'center',
                borderWidth: 2,
                borderRadius: 20,
                margin: 10,
                backgroundColor: '#A31621'
            }}>
                <Icon
                    name='account-hard-hat'
                    type='material-community'
                    size={50}
                    color='white'
                />
                <Text style={{
                    color: 'white',
                    fontSize: 30,
                }}>
                    Investigador
                </Text>
            </View>
            <View style={{
                ...styles.body,
                flex: 2,
                justifyContent: 'center',
                borderWidth: 2,
                borderRadius: 20,
                margin: 10,
                backgroundColor: '#111d4a'
            }}>
                <Icon
                    name='map-marker-distance'
                    type='material-community'
                    size={50}
                    color='white'
                />

                <Text style={{
                    color: 'white',
                    fontSize: 30,
                }}>
                    Colaborador
                </Text>
            </View>
        </View>
    )
}
