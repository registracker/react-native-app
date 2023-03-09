import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Chip, FAB, SpeedDial} from '@rneui/base';
import {format} from 'date-fns';
import Geolocation from 'react-native-geolocation-service';
import uuid from 'react-native-uuid';
import BackgroundService from 'react-native-background-actions';

import {MediosDesplazamientosComponentes} from '../components/MediosDesplazamientosComponentes';
import { addItemDesplazamiento, createTableDesplazamiento } from '../database/TblDesplazamientos';
import {getMediosDesplazamientos} from '../services/mediosDesplazamientoServices';
import {getIncidentes} from '../services/incidenteServices';

import {primary, styles} from '../styles/style';
import {RecorridosContext} from '../context/Recorrido/RecorridosContext';
import {ModalComponent} from '../components/ModalComponent';
import {createTableMediosDesplazamiento} from '../database/TblMediosDesplazamientos';
import { createTableIncidentes, createTableReporteIncidentes, storeReporteIncidente } from '../database/TblIncidentes';
import {Loading} from '../components/Loading';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

import {CatalogosContext} from '../context/Catalogos/CatalogosContext'

export const Desplazamiento = () => {
  const [data, setData] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [position, setPosition] = useState();
  const [watchId, setWatchId] = useState();
  const [viajeIniciado, setViajeIniciado] = useState(false);
  const [open, setOpen] = useState(false);
  const [uuidDesplazamiento, setUuidDesplazamiento] = useState();
  const [medio, setMedio] = useState({ id: 1, nombre: 'Caminando', icono: 'walk' });
  const [mediosDesplazamientos, setMediosDesplazamientos] = useState();
  const [fechaHoraInciado, setFechaHoraInciado] = useState();
  const [modalMarcadores, setModalMarcadores] = useState(false);
  const [marcadores, setMarcadores] = useState();
  const [marcadorSelected, setMarcadorSelected] = useState();
  const [incidentes, setIncidentes] = useState();
  const [modalIncidentes, setModalIncidentes] = useState(false);
  const [incidenteSelected, setIncidenteSelected] = useState();
  const [contadorMedio, setContadorMedio] = useState(0);
  const [loading, setLoading] = useState(true)

  const {desplazamientoState, insertarPunto, restaurar} =
    useContext(RecorridosContext);

  const { ctl_medios_desplazamientos, ctl_incidentes, obtenerMediosDesplazamientos, obtenerIncidentes  } = useContext(CatalogosContext)


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

  const created = async () => {
    await obtenerMediosDesplazamientos() 
    await obtenerIncidentes()
  };

  const getLocation = () => {
    setData([])
    setViajeIniciado(true);
    setUuidDesplazamiento(uuid.v4());
    setFechaHoraInciado(new Date());


    Geolocation.getCurrentPosition(
      position => {
        setPosition(position);
        setData([...data, position]);
      },
      error => {
        // See error code charts below.
        console.error(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
      },
    );

    return position;
  };

  const getLocationObservation = () => {
    setViajeIniciado(true);
    setUuidDesplazamiento(uuid.v4());
    setFechaHoraInciado(new Date());


    const observation = Geolocation.watchPosition(
      position => {
        setPosition(position);
        setData([...data, position]);
      },
      error => {
        console.error(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        interval: 5000,
        distanceFilter: 0,
      },
    );

    setWatchId(observation);
  };

  const IniciarDesplazamiento = async () => {
    setViajeIniciado(true);
    setUuidDesplazamiento(uuid.v4());
    setFechaHoraInciado(new Date());

    const detener = time =>
      new Promise(resolve => setTimeout(() => resolve(), time));
    const veryIntensiveTask = async taskDataArguments => {
      // Example of an infinite loop task
      const {delay} = taskDataArguments;
      await new Promise(async resolve => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          console.log(i);
          Geolocation.getCurrentPosition(
            position => {
              console.log('POSITION', JSON.stringify(position))
            },
            error => {
              // See error code charts below.
              console.error(error.code, error.message);
            },
            {
              enableHighAccuracy: true,
              distanceFilter: 0,
            },
          );

          await detener(delay);
        }
      });
    };

    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'registrando desplazamiento',
    });
  };

  const stopLocationObserving = async () => {
    setViajeIniciado(false);

    if (data.length > 0) {
      const data = {
        uuid: uuidDesplazamiento,
        desplazamiento: JSON.stringify(puntos, null),
        fecha_registro: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
      };
      addItemDesplazamiento(data);

      const mensaje = 'Desplazamiento finalizado';
      const subtitulo = `Registrado en la fecha ${data.fecha_registro}`;

      notificacion(mensaje, subtitulo);
    }
    restaurar();
    setData([]);
    setUuidDesplazamiento();
    setContadorMedio(0);
    Geolocation.clearWatch(watchId);
  };

  const openModalIncidentes = async () => {
    setModalIncidentes(true);
    setOpen(false);
  };

  const getUbicacionActual = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
        },
      );
    });
  };

  useEffect(() => {
    createTableDesplazamiento();
    createTableMediosDesplazamiento();
    createTableIncidentes();
    createTableReporteIncidentes();
    created();
  }, []);

  //Detectar cambios de la posicion
  useEffect(() => {
    if (position) {
      const point = {
        latitud: position.coords.latitude,
        longitud: position.coords.longitude,
        fecha_registro: position.timestamp,
        velocidad: position.coords.speed,
        id_medio_desplazamiento: medio.id,
        agrupacion_medio_desplazamiento: contadorMedio,
      };
      setData([...data, position]);
      setPuntos([...puntos, point]);
      insertarPunto({uuid: uuidDesplazamiento, punto: point});
    }
  }, [position]);

  useEffect(() => {
    if (viajeIniciado) setContadorMedio(contadorMedio + 1);
  }, [medio]);

  useEffect(() => {
    if (incidenteSelected) {
      enviarIncidente(incidenteSelected, uuidDesplazamiento);
    }
  }, [incidenteSelected]);

  const enviarIncidente = async (incidente, uuid = null) => {
    const position = await getUbicacionActual();

    const data = {
      desplazamiento_id: uuid,
      id_incidente: incidente.id,
      icono: incidente.icono,
      nombre: incidente.nombre,
      longitud: position.coords.longitude,
      latitud: position.coords.latitude,
      altitud: position.coords.altitude,
      fecha_reporte: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    };
    const response = await storeReporteIncidente(data);
    if (response.rowsAffected === 1) {
      const mensaje = 'Incidente registrado';
      const subtitulo = `${data.nombre} registrado la fecha de ${data.fecha_reporte}`;
      notificacion(mensaje, subtitulo);
    }
  };

  const notificacion = (mensaje, subtitulo = '') => {
    Toast.show({
      type: 'success',
      text1: mensaje,
      text2: subtitulo,
    });
  };






  return (
    <View style={styles.container}>
      <ModalComponent
        modalVisible={modalIncidentes}
        setModalVisible={setModalIncidentes}
        setItem={setIncidenteSelected}
        data={ctl_incidentes.data}
      />
      <View style={styles.body}>
        <Text style={styles.subtitleText}>
          Elige tu medio de desplazamientos
        </Text>

        <MediosDesplazamientosComponentes
          selected={medio}
          cambiarMedio={setMedio}
          mediosDesplazamientos={ctl_medios_desplazamientos.data}
        />
      </View>

      <View style={styles.foobar}>
        {/* Deja un espacio vació entre los medios de desplazamientos y los botones de FAB */}
      </View>

      <>
        {viajeIniciado ? (
          <FAB
            visible={viajeIniciado}
            onPress={stopLocationObserving}
            title="Detener viaje"
            placement="left"
            upperCase
            icon={stylesDesplazamiento.iconoTerminarViaje}
            style={{marginBottom: 20}}
            color={styles.primary}
          />
        ) : (
          <FAB
            visible
            onPress={getLocationObservation}
            title="Comenzar el viaje"
            placement="left"
            upperCase
            icon={stylesDesplazamiento.iconoComenzarViaje}
            style={{marginBottom: 20}}
            color="green"
          />
        )}
      </>
      <SpeedDial
        isOpen={open}
        icon={stylesDesplazamiento.iconoFAB}
        openIcon={stylesDesplazamiento.iconoFABClose}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        color={styles.primary}>
        <SpeedDial.Action
          title="Incidente"
          icon={stylesDesplazamiento.iconoIncidente}
          color={styles.primary}
          onPress={openModalIncidentes}
        />
      </SpeedDial>
    </View>
  );
};

const stylesDesplazamiento = StyleSheet.create({
  panel: {
    backgroundColor: styles.primary,
    padding: '2%',
    margin: '5%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 20,
  },
  textPanel: {color: 'white', fontSize: 12},
  textTitlePanel: {color: 'white', fontSize: 20},
  iconoFAB: {
    name: 'map-marker-radius',
    color: 'white',
    type: 'material-community',
  },
  iconoIncidente: {
    name: 'marker-check',
    color: 'white',
    type: 'material-community',
  },
  iconoFABClose: {name: 'close', color: 'white'},
  iconoComenzarViaje: {
    name: 'map-marker-distance',
    color: 'white',
    type: 'material-community',
  },
  iconoTerminarViaje: {
    name: 'stop-circle-outline',
    color: 'white',
    type: 'material-community',
  },
});
