import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Chip, FAB, SpeedDial } from '@rneui/base';
import { format } from 'date-fns';
import Geolocation from 'react-native-geolocation-service';
import uuid from 'react-native-uuid';

import { MediosDesplazamientosComponentes } from '../components/MediosDesplazamientosComponentes';
import { addItemDesplazamiento, createTableDesplazamiento } from '../database/TblDesplazamientos';
import { getMediosDesplazamientos } from '../services/mediosDesplazamientoServices'

import { styles } from '../styles/style';
import { useFocusEffect } from '@react-navigation/core';
import { useCallback } from 'react';

export const Desplazamiento = () => {

    const [data, setData] = useState([])
    const [puntos, setPuntos] = useState([])
    const [position, setPosition] = useState()
    const [watchId, setWatchId] = useState()
    const [viajeIniciado, setViajeIniciado] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [uuidDesplazamiento, setUuidDesplazamiento] = useState()
    const [medio, setMedio] = useState({ id: 1, nombre: 'Caminando', icono: 'run' })
    const [mediosDesplazamientos, setMediosDesplazamientos] = useState()
    const [fechaHoraInciado, setFechaHoraInciado] = useState()

    useEffect(() => {
        createTableDesplazamiento()
        getMD();
    }, [])

    useFocusEffect(
        useCallback(() => {
            if (!mediosDesplazamientos) getMD()
        }, [])
    );

    const getMD = async () => {
        const { data } = await getMediosDesplazamientos();
        setMediosDesplazamientos(data)
    }

    useEffect(() => {
        if (position) {
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
        setFechaHoraInciado(new Date());

        const observation = await Geolocation.watchPosition(
            (position) => {
                setPosition(position)
                setData([...data, position])
            },
            (error) => {
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
            const data = {
                uuid: uuidDesplazamiento,
                desplazamiento: JSON.stringify(puntos, null),
                fecha_registro: format(new Date(), 'dd-MM-yyyy HH:mm:ss')
            }
            addItemDesplazamiento(data)
        }
        setData([])
        Geolocation.clearWatch(watchId);
    }

    return (
        <View style={styles.container}>

            <View style={{
                backgroundColor: styles.primary,
                padding: '2%',
                margin: '5%',
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                borderRadius: 20
            }}>
                <View>
                    {
                        viajeIniciado ? (

                            <>

                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    Estado del viaje: Inicado
                                </Text>
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    Fecha: {format(fechaHoraInciado, 'dd-MM-yyyy')}
                                </Text>
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    Hora iniciado: {format(fechaHoraInciado, 'HH:mm:ss')}
                                </Text>
                            </>
                        ) : (
                            <>
                                    <Text style={{ color: 'white', fontSize: 20 }}>
                                        Comenzar viaje
                                    </Text>
                            </>
                        )
                    }
                </View>
                <Chip
                    title={medio.nombre}
                    titleStyle={{ color: styles.primary }}
                    icon={{
                        name: medio.icono,
                        type: 'material-community',
                        color: styles.primary
                    }}
                    color='white'
                />

            </View>

            <View style={{ ...styles.body, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                </View>
                <Text style={{ color: 'black' }}>
                    {JSON.stringify(position, null, 5)}
                </Text>

                <MediosDesplazamientosComponentes
                    selected={medio}
                    cambiarMedio={setMedio}
                    mediosDesplazamientos={mediosDesplazamientos}
                />
            </View>

            <View style={styles.foobar}>
            </View>
            <>
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
                                color='green'
                            />
                        )
                }
            </>
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
