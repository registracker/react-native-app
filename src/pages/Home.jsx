import { format } from 'date-fns/esm';
import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import Geolocation, { stopObserving } from 'react-native-geolocation-service';


export const Home = () => {

    const [time, setTime] = useState(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
    const [data, setData] = useState([])
    const [position, setPosition] = useState()


    const getLocation = () => {



        Geolocation.getCurrentPosition(
            (position) => {
                setPosition(position)
                console.log(format(new Date(position.timestamp), 'yyyy-MM-dd HH:mm:ss'), position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // See error code charts below.
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 25,
                timeout: 15000,
                maximumAge: 10000
            }
        )

        return position;
    }

    const getLocationObservation = async () => {

        const observation = await Geolocation.watchPosition(
            (position) => {
                setPosition(position)
                setData([...data, position])
                console.log('WATCH', format(new Date(position.timestamp), 'yyyy-MM-dd HH:mm:ss'), position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // See error code charts below.
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                // distanceFilter: 25,
                // timeout: 15000,
                // maximumAge: 10000
                interval: 5000,
            }
        )

    }


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                {JSON.stringify(position, null, 5)}
            </Text>

                <Button
                    title='Get Location'
                    onPress={getLocation}
                />

                <Button
                    title='Observar'
                    onPress={getLocationObservation}
                />


                <Text>
                    {JSON.stringify(position, null, 5)}
                </Text>
        </View>
    )
}



