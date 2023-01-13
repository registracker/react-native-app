import { format } from 'date-fns/esm';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Button, Linking, Alert } from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import getDirections from 'react-native-google-maps-directions';


export const Home = () => {

    const [time, setTime] = useState(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
    const [data, setData] = useState([])
    const [puntos, setPuntos] = useState([])
    const [position, setPosition] = useState()
    const [watchId, setWatchId] = useState()
    const [primerPunto, setPrimerPunto] = useState({})
    const [ultimoPunto, setUltimoPunto] = useState({})

    useEffect(() => {
        if (position) {
            setData([...data, position])
            setPuntos(
                [...puntos, 
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                ]
            )

        }
    }, [position])



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
                // interval: 5000,
            }
        )

        setWatchId(observation);

    }

    const stopLocationObserving = () => {

        console.log('Detener Observing', watchId);
        // console.log("🚀 ~ file: Home.jsx:127 ~ handleGetDirections ~ data", data[0].coords.latitude, data[0].coords.longitude)

        const comienzo = {
            latitude: data[0].coords.latitude,
            longitude: data[0].coords.longitude
        }
        const final = {
            latitude: data[data.length - 1].coords.latitude,
            longitude: data[data.length - 1].coords.longitude
        }
        console.log("🚀 ~ file: Home.jsx:74 ~ stopLocationObserving ~ comienzo", comienzo)
        console.log("🚀 ~ file: Home.jsx:79 ~ stopLocationObserving ~ final", final)
        setPrimerPunto(comienzo)
        setUltimoPunto(final)
        setData([])

        Geolocation.clearWatch(watchId);
    }


    const handleGetDirections = async () => {

        console.log(primerPunto);
        console.log(ultimoPunto);
        console.log(puntos);

        const travel = {
            source: primerPunto,
            destination: ultimoPunto,
            params: [

            ],
            waypoints: puntos
        }

        await getDirections(travel)
    }


    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);
            console.log(supported);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <Button title={children} onPress={handlePress} />;
    };

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

            <Button
                title='Detener'
                onPress={stopLocationObserving}
            />

            <Button onPress={handleGetDirections} title="Get Directions" />
        </View>
    )
}



