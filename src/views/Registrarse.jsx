import { Chip, Icon } from '@rneui/base'
import React, { useState } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { styles } from '../styles/style'

export const Registrarse = () => {

    const [confirmInvestigador, setConfirmInvestigador] = useState(false)

    const touchInvestigator = () => {
        console.log("INVESTIGADOR");
    }

    return (
        <View style={styles.container}>
            <TouchableHighlight style={{
                ...styles.body,
                flex: 2,
                justifyContent: 'center',
                borderWidth: 2,
                borderRadius: 20,
                margin: 10,
                backgroundColor: '#A31621'
            }}
                onPress={touchInvestigator}
            >

                <View>
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
            </TouchableHighlight>
            <TouchableHighlight style={{
                ...styles.body,
                flex: 2,
                justifyContent: 'center',
                borderWidth: 2,
                borderRadius: 20,
                margin: 10,
                backgroundColor: '#111d4a'
            }}
                onPress={touchInvestigator}
            >

                <View >
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
            </TouchableHighlight>
        </View>
    )
}
