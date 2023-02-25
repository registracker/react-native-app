import { FAB, SpeedDial } from '@rneui/base';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import { styles } from '../styles/style';
import { MediosDesplazamientosComponentes } from '../components/MediosDesplazamientosComponentes';
import { addItemDesplazamiento, createTableDesplazamiento } from '../database/TblDesplazamientos';
import uuid from 'react-native-uuid';

export const Desplazamiento = ({ route, navigation }) => {

    const [data, setData] = useState([])
    const [puntos, setPuntos] = useState([])
    const [position, setPosition] = useState()
    const [watchId, setWatchId] = useState()
    const [primerPunto, setPrimerPunto] = useState({})
    const [ultimoPunto, setUltimoPunto] = useState({})
    const [viajeIniciado, setViajeIniciado] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [uuidDesplazamiento, setUuidDesplazamiento] = useState()
    const [medio, setMedio] = useState({ id: 1, nombre: 'Caminando', icono: '🚶'})

    useEffect(() => {
        createTableDesplazamiento()
    }, [])
    

    useEffect(() => {
        if (position) {
            console.log("New POINT");
            setData([...data, position])
            setPuntos(
                [...puntos,
                {
                    latitud: position.coords.latitude,
                    longitud: position.coords.longitude,
                    fecha_registro: position.timestamp,
                    velocidad: position.coords.speed,
                    id_medio_desplazamiento: medio.id,
                }
                ]
            )

        }
    }, [position])



    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setPosition(position)
                // console.log(format(new Date(position.timestamp), 'yyyy-MM-dd HH:mm:ss'), position.coords.latitude, position.coords.longitude);

                point = {
                    longitud: position.coords.longitude,
                    latitud: position.coords.latitude,
                }

                addItem('tbl_recorrido', null, point)
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

        setViajeIniciado(true)
        setUuidDesplazamiento(uuid.v4());

        const observation = await Geolocation.watchPosition(
            (position) => {
                setPosition(position)
                setData([...data, position])
                // console.log('WATCH', format(new Date(position.timestamp), 'yyyy-MM-dd HH:mm:ss'), position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // See error code charts below.
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                interval: 5000,
                distanceFilter: 0
            }
        )

        setWatchId(observation);

    }

    const stopLocationObserving = () => {

        setViajeIniciado(false);
        


        if (data.length > 0) {
            // const comienzo = {
            //     latitude: data[0].coords.latitude,
            //     longitude: data[0].coords.longitude
            // }
            // const final = {
            //     latitude: data[data.length - 1].coords.latitude,
            //     longitude: data[data.length - 1].coords.longitude
            // }
            // setPrimerPunto(comienzo)
            // setUltimoPunto(final)

            // const desplazamiento = puntos.map(a => `(${Object.values(a).join(", ")})`)
            //     .join(", ")


            const data = {
                uuid: uuidDesplazamiento,
                desplazamiento: JSON.stringify(puntos),
                fecha_registro: format(new Date(), 'dd-MM-yyyy HH:mm:ss')
            }
            addItemDesplazamiento(data)




        }

        // console.log("🚀 ~ file: Home.jsx:74 ~ stopLocationObserving ~ comienzo", comienzo)
        // console.log("🚀 ~ file: Home.jsx:79 ~ stopLocationObserving ~ final", final)

        setData([])
        Geolocation.clearWatch(watchId);
    }

    const handleGetDirections = async () => {

        const travel = {
            source: primerPunto,
            destination: ultimoPunto,
            params: [

            ],
            waypoints: puntos
        }
        console.log(JSON.stringify(travel, null, 3));
    }


    return (
        <View style={styles.container}>

            <View style={{ ...styles.body, justifyContent: 'space-between' }}>
                <Text style={{ ...styles.titleText, justifyContent: 'center' }} >{medio.icono} {medio.nombre} </Text>
                <Text>
                    {JSON.stringify(position, null, 5)}
                </Text>

                <MediosDesplazamientosComponentes
                    selected={medio}
                    cambiarMedio={setMedio}
                />
            </View>

            <View style={styles.foobar}>
                {/* <Button
                    title="Obtener puntos"
                    onPress={handleGetDirections}
                    buttonStyle={styles.buttonSecondary}
                    disabledStyle={styles.buttonSecondaryDisabled}
                    radius="lg"
                    containerStyle={styles.buttonContainer}
                />
                <Button
                    title="Obtener Ubicación"
                    onPress={getLocation}
                    buttonStyle={styles.buttonPrimary}
                    disabledStyle={styles.buttonPrimaryDisabled}
                    radius="lg"
                    containerStyle={styles.buttonContainer}
                />
                <Button
                    title="Comenzar viaje"
                    onPress={getLocationObservation}
                    buttonStyle={styles.buttonPrimary}
                    disabledStyle={styles.buttonPrimaryDisabled}
                    radius="lg"
                    containerStyle={styles.buttonContainer}
                />
                <Button
                    title="Detener viaje"
                    onPress={stopLocationObserving}
                    buttonStyle={styles.buttonSecondary}
                    disabledStyle={styles.buttonSecondaryDisabled}
                    radius="lg"
                    containerStyle={styles.buttonContainer}
                /> */}



            </View>
            {
                viajeIniciado
                    ? (
                        <FAB
                            visible={viajeIniciado}
                            onPress={stopLocationObserving}
                            title="Detener viaje"
                            placement='left'
                            upperCase
                            icon={{ name: 'stop-circle-outline', color: 'white', type: 'material-community' }}
                            style={{ marginBottom: 20 }}
                            color={styles.primary}
                        />
                    ) : (
                        <FAB
                            visible
                            onPress={getLocationObservation}
                            title="Comenzar el viaje"
                            placement='left'
                            upperCase
                            icon={{ name: 'map-marker-distance', color: 'white', type: 'material-community' }}
                            style={{ marginBottom: 20 }}
                            color={styles.primary}
                        />
                    )
            }



            <SpeedDial
                isOpen={open}
                icon={{ name: 'map-marker-radius', color: '#fff', type: 'material-community' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
                // style={{ }}
                color={styles.primary}
            >
                <SpeedDial.Action
                    icon={{ name: 'marker-check', color: '#fff', type: 'material-community' }}
                    title="Marcador"
                    color={styles.primary}
                    onPress={() => console.log('Add Something')}
                />
                <SpeedDial.Action
                    icon={{ name: 'bullhorn', color: '#fff', type: 'material-community' }}
                    title="Incidente"
                    color={styles.primary}
                    onPress={() => console.log('Delete Something')}
                />
            </SpeedDial>

        </View>
    )
}
