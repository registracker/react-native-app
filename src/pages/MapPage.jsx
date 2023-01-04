import React from 'react'
import { View,Text } from 'react-native'

export const MapPage = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                map
                <Button
                    title="Go to Home"
                    onPress={() => navigation.navigate('Home')}
                />
                <Button title="Go back" onPress={() => navigation.goBack()} />
            </Text>
        </View>
    )
}
