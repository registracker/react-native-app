import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Geolocation from 'react-native-geolocation-service';


export const Home = () => {

    const [position, setPosition] = useState()


    Geolocation.watchPosition(
        (position) => {
            setPosition(position)
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                {JSON.stringify(position, null, 5)}
            </Text>
        </View>
    )
}
