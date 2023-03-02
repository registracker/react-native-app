import React, { useContext, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Chip, FAB, SpeedDial } from '@rneui/base';
import { format } from 'date-fns';
import Geolocation from 'react-native-geolocation-service';
import uuid from 'react-native-uuid';
import BackgroundService from 'react-native-background-actions';

import { MediosDesplazamientosComponentes } from '../components/MediosDesplazamientosComponentes';
import { addItemDesplazamiento, createTableDesplazamiento } from '../database/TblDesplazamientos';
import { getMediosDesplazamientos } from '../services/mediosDesplazamientoServices'
import { getMarcadores } from '../services/marcadorServices'

import { styles } from '../styles/style';
import { useFocusEffect } from '@react-navigation/core';
import { useCallback } from 'react';
import { RecorridosContext } from '../context/Recorrido/RecorridosContext';
import { ModalComponent } from '../components/ModalComponent';

export const Desplazamiento = () => {

    const [data, setData] = useState([])
    const [puntos, setPuntos] = useState([])
    const [position, setPosition] = useState()
    const [watchId, setWatchId] = useState()
    const [viajeIniciado, setViajeIniciado] = useState(false)
    const [open, setOpen] = useState(false);
    const [uuidDesplazamiento, setUuidDesplazamiento] = useState()
    const [medio, setMedio] = useState({ id: 1, nombre: 'Caminando', icono: 'run' })
    const [mediosDesplazamientos, setMediosDesplazamientos] = useState()
    const [fechaHoraInciado, setFechaHoraInciado] = useState()
    const [modalMarcadores, setModalMarcadores] = useState(false)
    const [marcadores, setMarcadores] = useState()

    const { desplazamientoState, insertarPunto, restaurar } = useContext(RecorridosContext)

    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 5000,
        },
    };

    const created = async () => {
        const { data: marcadores } = await getMarcadores();
        const { data: medios_desplazamientos } = await getMediosDesplazamientos()
        setMediosDesplazamientos(medios_desplazamientos)
        setMarcadores(marcadores)
    }

    const getLocation = async () => {
        await Geolocation.getCurrentPosition(
            (position) => {
                // setPosition(position)
                // // console.log(format(new Date(position.timestamp), 'yyyy-MM-dd HH:mm:ss'), position.coords.latitude, position.coords.longitude);

                // point = {
                //     longitud: position.coords.longitude,
                //     latitud: position.coords.latitude,
                // }

                // addItem('tbl_recorrido', null, point)
                setPosition(position)
                setData([...data, position])
            },
            (error) => {
                // See error code charts below.
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 0,
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

    const IniciarDesplazamiento = async () => {
        setViajeIniciado(true)
        setUuidDesplazamiento(uuid.v4());
        setFechaHoraInciado(new Date());


        const detener = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
        const veryIntensiveTask = async (taskDataArguments) => {
            // Example of an infinite loop task
            const { delay } = taskDataArguments;
            await new Promise(async (resolve) => {
                for (let i = 0; BackgroundService.isRunning(); i++) {
                    await getLocation()
                    await detener(delay);
                }
            });
        };

        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({ taskDesc: 'registrando desplazamiento' }); // Only Android, iOS will ignore this call

    }

    const stopLocationObserving = async () => {
        setViajeIniciado(false);

        await BackgroundService.stop();

        if (data.length > 0) {
            const data = {
                uuid: uuidDesplazamiento,
                desplazamiento: JSON.stringify(puntos, null),
                fecha_registro: format(new Date(), 'dd-MM-yyyy HH:mm:ss')
            }
            addItemDesplazamiento(data)
        }
        restaurar()
        setData([])
        Geolocation.clearWatch(watchId);
    }

    const openModalMarcadores = async () => {
        setModalMarcadores(true)
        setOpen(false)
    }

    useEffect(() => {
        createTableDesplazamiento()
        created();
    }, [])

    // useFocusEffect(
    //     useCallback(() => {
    //         if (!mediosDesplazamientos) getCatalogos()
    //     }, [])
    // );

    useEffect(() => {
        if (position) {
            const point = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude,
                fecha_registro: position.timestamp,
                velocidad: position.coords.speed,
                id_medio_desplazamiento: medio.id,
            }
            setData([...data, position])
            setPuntos([...puntos, point])
            insertarPunto({ uuid: uuidDesplazamiento, punto: point })

        }
    }, [position])


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
                    {/* {JSON.stringify(desplazamientoState.ultimoPunto, null, 5)} */}
                    {desplazamientoState.cantidadPuntos}
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
                                onPress={IniciarDesplazamiento}
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
            <ModalComponent
                modalVisible={modalMarcadores}
                setModalVisible={setModalMarcadores}
                setItem={setMarcadores}
                data={marcadores}
                setOpen={setOpen}
            />
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
                    onPress={openModalMarcadores}
                />
                {/* <SpeedDial.Action
                    icon={{ name: 'bullhorn', color: '#fff', type: 'material-community' }}
                    title="Incidente"
                    color={styles.primary}
                    onPress={() => console.log('Delete Something')}
                /> */}
            </SpeedDial>
        </View>
    )
}
