import { Button } from '@rneui/base';
import React from 'react'
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Icon } from '@rneui/themed';

export const PanelPrincipal = ({navigation}) => {

    const onPress = () => {
        console.log("ON PRESS");
    };
    const pantallas = [
        "Recorrido",
    ]

    return (
        <View>
            <Pressable
                onPress={() => navigation.navigate('MapPage')}
                style={styles.menu}
            >
                <Icon
                    name='map-marker' 
                    type='material-community'
                    size={50}
                    />

                    <Text>I'm pressable!</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
    menu: {
        flexDirection: 'row',
        margin: 50,
        justifyContent: 'space-evenly',
        borderColor: 'black',
        borderWidth: 4,
        padding: 40,
        alignItems: 'center',
    }
})