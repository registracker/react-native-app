import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ToastAndroid } from 'react-native';
import { FAB, Icon, SpeedDial } from '@rneui/base';
import Geolocation from 'react-native-geolocation-service';

import BackgroundActions from 'react-native-background-actions';
import KeepAwake from '@sayem314/react-native-keep-awake';

//Componentes
import { primary, styles } from '../styles/style';
import { MediosDesplazamientosComponentes } from '../components/MediosDesplazamientosComponentes';
import { ModalComponent } from '../components/ModalComponent';
import { MarcadorModalComponent } from '../components/MarcadorModalComponent';
import RutaTransporteModalComponent from '../components/RutaTransporteModalComponent';
import CostoDesplazamientoModalComponent from '../components/CostoDesplazamientoModalComponent';

//Context
import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext';
import { NetworkContext } from '../context/network/NetworkContext';

//FUNCIONES
import { getUbicacionActual } from '../utils/functions';
import { showToast } from '../utils/toast';

const LOCATION_TASK_NAME = 'locationTask';

export const Desplazamiento = () => {
  const [position, setPosition] = useState();
  const [viajeIniciado, setViajeIniciado] = useState(false);
  const [open, setOpen] = useState(false);
  const [medio, setMedio] = useState({ id: 1, nombre: 'Caminando', icono: 'walk' });
  const [modalIncidentes, setModalIncidentes] = useState(false);
  const [modalMarcador, setModalMarcador] = useState(false);
  const [medioTransporteModal, setMedioTransporteModal] = useState(false)
  const [costoDesplazamientoModal, setCostoDesplazamientoModal] = useState(false)

  const { agregarMedioDesplazamiento, iniciarDesplazamiento, registrarDesplazamiento } = useContext(DesplazamientoContext)
  const { isConnected } = useContext(NetworkContext)

  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const configureBackgroundActions = async () => {
    const taskOptions = {
      taskName: LOCATION_TASK_NAME,
      taskTitle: 'Viaje Iniciado',
      taskDesc: 'Registrando desplazamiento',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      parameters: {
        delay: 5000, // Intervalo de tiempo en milisegundos (5 segundos)
      },
    };

    const locationTask = async (taskData) => {
      try {
        const { delay } = taskData;

        const watch = Geolocation.watchPosition(
          position => {
            setPosition(position);
          },
          error => {
            showToast('Error en obtener la ubicación', ToastAndroid.LONG);
          },
          {
            enableHighAccuracy: true,
            interval: 5000,
            distanceFilter: 0,
          }
        );
        do {
          await sleep(delay);

        } while (BackgroundActions.isRunning());
        Geolocation.clearWatch(watch);
        return taskData;
      } catch (error) {
        showToast('Error en la tarea en segundo plano', ToastAndroid.LONG);
      }
    };

    try {
      await BackgroundActions.start(locationTask, taskOptions);
    } catch (error) {
      showToast('Error al iniciar la tarea en segundo plano', ToastAndroid.LONG);
    }
  };


  const getLocationObservation = () => {
    setViajeIniciado(true);
    configureBackgroundActions();
  };

  const stopLocationObserving = async () => {
    if (viajeIniciado) {
      setViajeIniciado(false);
      BackgroundActions.stop(LOCATION_TASK_NAME);
      setPosition()
      setCostoDesplazamientoModal(true);  //Modal for displaying costo de desplazamiento
      showToast('Viaje finalizado', ToastAndroid.LONG);
    }
  };

  /**
  * Abrir Modal de ingreso de incidentes
  */
  const openModalIncidentes = () => {
    setModalIncidentes(true);
    setOpen(false);
  };

  /**
   * Abrir Modal de ingreso de marcadores y levantamientos
   */
  const openModalMarcadores = () => {
    setModalMarcador(true);
    setOpen(false);
  };


  useEffect(() => {
    if (viajeIniciado) registrarDesplazamiento(position, medio);
  }, [position])


  useEffect(() => {
    if (medio.nombre === 'Autobús' && viajeIniciado && isConnected) setMedioTransporteModal(true)
  }, [medio]);

  useEffect(() => {
    if (viajeIniciado) {
      iniciarDesplazamiento()
      agregarMedioDesplazamiento(medio)
      if (medio.nombre === 'Autobús' && isConnected) setMedioTransporteModal(true)
    }
  }, [viajeIniciado])


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/fondo.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <KeepAwake />
        <MarcadorModalComponent
          open={modalMarcador}
          setOpen={setModalMarcador}
          getUbicacion={getUbicacionActual}
        />
        <ModalComponent
          modalVisible={modalIncidentes}
          setModalVisible={setModalIncidentes}
        />
        <RutaTransporteModalComponent
          open={medioTransporteModal}
          setOpen={setMedioTransporteModal}
        />
        <CostoDesplazamientoModalComponent
          open={costoDesplazamientoModal}
          setOpen={setCostoDesplazamientoModal}
        />
        <View style={styles.row}>
          <View style={styles.chip}>
            <Icon name='cellphone-marker' type='material-community' color={'white'} style={{ marginRight: 5 }} />
            {
              isConnected && viajeIniciado ?
                <Text style={styles.text}>Registrando</Text>
                : !isConnected && viajeIniciado ?
                  <Text style={styles.text}>Registrando sin conexión</Text>
                  :
                  <Text style={{ ...styles.textBlack, color: 'white', fontWeight: 'bold' }}>REGISTRACKER</Text>
            }
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>
            Elige tu modo de desplazamiento
          </Text>
          <MediosDesplazamientosComponentes
            selected={medio}
            cambiarMedio={setMedio}
          />
          <>
            {viajeIniciado ? (
              <FAB
                visible={viajeIniciado}
                onPress={stopLocationObserving}
                title="Detener viaje"
                placement="left"
                upperCase
                icon={stylesDesplazamiento.iconoTerminarViaje}
                style={{ marginBottom: 20 }}
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
                style={{ marginBottom: 20 }}
                color="green"
              />
            )}
          </>
        </View>
        <SpeedDial
          isOpen={open}
          icon={stylesDesplazamiento.iconoFAB}
          openIcon={stylesDesplazamiento.iconoFABClose}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
          color={styles.primary}>
          <SpeedDial.Action
            title="Marcador"
            icon={stylesDesplazamiento.iconoMarcador}
            color={styles.primary}
            onPress={openModalMarcadores}
            titleStyle={{...styles.textBlack, borderRadius:15}}
          />
          <SpeedDial.Action
            title="Incidente"
            icon={stylesDesplazamiento.iconoIncidente}
            color={styles.primary}
            onPress={openModalIncidentes}
            titleStyle={{ ...styles.textBlack, borderRadius: 15 }}
          />
        </SpeedDial>
      </ImageBackground>
    </View>
  );
};

const stylesDesplazamiento = StyleSheet.create({
  panel: {
    backgroundColor: primary,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 3,
    margin: 10,
    padding: 10,
  },
  panelOff: {
    backgroundColor: '#d0d0d0',
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    borderWidth: 3,
    margin: 10,
    padding: 10,
  },
  textPanel: { color: 'white', fontSize: 14 },
  textPanelOff: {
    color: 'black', fontSize: 14
  },
  backgroundImage: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    padding: 0,
    borderRadius: 5,
  },
  textTitlePanel: { color: 'white', fontSize: 20 },
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
  iconoMarcador: {
    name: 'map-marker-check',
    color: 'white',
    type: 'material-community',
  },
  iconoFABClose: { name: 'close', color: 'white' },
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
