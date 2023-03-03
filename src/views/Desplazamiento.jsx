import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ToastAndroid } from 'react-native'
import { Chip, FAB, SpeedDial } from '@rneui/base';
import { format } from 'date-fns';
import Geolocation from 'react-native-geolocation-service';
import uuid from 'react-native-uuid';
import BackgroundService from 'react-native-background-actions';

import { MediosDesplazamientosComponentes } from '../components/MediosDesplazamientosComponentes';
import { addItemDesplazamiento, createTableDesplazamiento } from '../database/TblDesplazamientos';
import { getMediosDesplazamientos } from '../services/mediosDesplazamientoServices'
import { getMarcadores } from '../services/marcadorServices'
import { getIncidentes, postIncidente } from '../services/incidenteServices'

import { primary, styles } from '../styles/style';
import { RecorridosContext } from '../context/Recorrido/RecorridosContext';
import { ModalComponent } from '../components/ModalComponent';
import { createTableMediosDesplazamiento } from '../database/TblMediosDesplazamientos';
import { createTableMarcadores } from '../database/TblMarcadores';
import { createTableIncidentes, createTableReporteIncidentes, storeReporteIncidente } from '../database/TblIncidentes';
import { Loading } from '../components/Loading';

export const Desplazamiento = () => {

    const [data, setData] = useState([])
    const [puntos, setPuntos] = useState([])
    const [position, setPosition] = useState()
    const [watchId, setWatchId] = useState()
    const [viajeIniciado, setViajeIniciado] = useState(false)
    const [open, setOpen] = useState(false);
    const [uuidDesplazamiento, setUuidDesplazamiento] = useState()
    const [medio, setMedio] = useState({ id: 1, nombre: 'Caminando', icono: 'walk' })
    const [mediosDesplazamientos, setMediosDesplazamientos] = useState()
    const [fechaHoraInciado, setFechaHoraInciado] = useState()
    const [modalMarcadores, setModalMarcadores] = useState(false)
    const [marcadores, setMarcadores] = useState()
    const [marcadorSelected, setMarcadorSelected] = useState()
    const [incidentes, setIncidentes] = useState()
    const [modalIncidentes, setModalIncidentes] = useState(false)
    const [incidenteSelected, setIncidenteSelected] = useState()
    const [contadorMedio, setContadorMedio] = useState(0)

    const { desplazamientoState, insertarPunto, restaurar } = useContext(RecorridosContext)

    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: primary,
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 5000,
        },
    };

    //Método para obtener los catalogos principales
    const created = async () => {
        //CATALOGO DE MEDIOS DE DESPLAMIENTO
        const medios_desplazamientos = await getMediosDesplazamientos()
        setMediosDesplazamientos(medios_desplazamientos)

        //CATALOGO DE MARCADORES
        const marcadores = await getMarcadores();
        setMarcadores(marcadores)

        //CATALOGO DE INCIDENTES
        const incidentes = await getIncidentes();
        setIncidentes(incidentes)

    }

    const getLocation = async () => {
        await Geolocation.getCurrentPosition(
            (position) => {
                setPosition(position)
                setData([...data, position])
            },
            (error) => {
                // See error code charts below.
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 0
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
                    console.log(i);

                    await detener(delay);
                }
            });
        };

        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({ taskDesc: 'registrando desplazamiento' });
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
        setUuidDesplazamiento()
        setContadorMedio(0)
        Geolocation.clearWatch(watchId);
    }

    const openModalMarcadores = async () => {
        setModalMarcadores(true)
        setOpen(false)
    }

    const openModalIncidentes = async () => {
        setModalIncidentes(true)
        setOpen(false)
    }


    const getUbicacionActual = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve(position)
                },
                (error) => {
                    reject(error)
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 0
                }
            )
        })
    }

    useEffect(() => {
        createTableDesplazamiento()
        createTableMediosDesplazamiento()
        createTableMarcadores()
        createTableIncidentes()
        createTableReporteIncidentes()
        created();
    }, [])

    //Detectar cambios de la posicion
    useEffect(() => {
        if (position) {
            const point = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude,
                fecha_registro: position.timestamp,
                velocidad: position.coords.speed,
                id_medio_desplazamiento: medio.id,
                agrupacion_medio_desplazamiento: contadorMedio
            }
            setData([...data, position])
            setPuntos([...puntos, point])
            insertarPunto({ uuid: uuidDesplazamiento, punto: point })

        }
    }, [position])


    useEffect(() => {
        if (viajeIniciado) setContadorMedio(contadorMedio + 1)
    }, [medio])

    useEffect(() => {
        console.log(incidenteSelected);
        if (incidenteSelected) {
            enviarIncidente(incidenteSelected, uuidDesplazamiento)
        }



    }, [incidenteSelected])


    const enviarIncidente = async (incidente, uuid = null) => {
        const position = await getUbicacionActual()

        const data = {
            desplazamiento_id: uuid,
            id_incidente: incidente.id,
            icono: incidente.icono,
            nombre: incidente.nombre,
            longitud: position.coords.longitude,
            latitud: position.coords.latitude,
            altitud: position.coords.altitude,
            fecha_reporte: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        }
        console.log("🚀 ~ file: Desplazamiento.jsx:246 ~ enviarIncidente ~ data:", typeof(data.fecha_reporte))
        const response = await storeReporteIncidente(data)
        if(response.rowsAffected === 1){
            const mensaje = '!Incidente almacenado!'
            notificacion(mensaje);
        }

    }

    const notificacion = (mensaje) => {
        ToastAndroid.showWithGravity(
            mensaje,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
        );
    };

    if (!mediosDesplazamientos || !incidentes) return <Loading />


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
            {/* <ModalComponent
                modalVisible={modalMarcadores}
                setModalVisible={setModalMarcadores}
                setItem={setMarcadorSelected}
                data={marcadores}
            /> */}
            <ModalComponent
                modalVisible={modalIncidentes}
                setModalVisible={setModalIncidentes}
                setItem={setIncidenteSelected}
                data={incidentes}
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
                    title="Incidente"
                    color={styles.primary}
                    onPress={openModalIncidentes}
                />
                {/* <SpeedDial.Action
                            icon={{ name: 'marker-check', color: '#fff', type: 'material-community' }}
                            title="Marcador"
                            color={styles.primary}
                            onPress={openModalMarcadores}
                        /> */}
            </SpeedDial>
        </View>
    )
}
