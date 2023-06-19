import React, { useEffect, useState } from 'react'
import { Button, Icon, ListItem } from '@rneui/base';
import { useContext } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { primary, styles } from '../styles/style';
import { AuthContext } from '../context/authentication/AuthContext'
import { Switch } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { NetworkContext } from '../context/network/NetworkContext';
import { useCallback } from 'react';


export const Ajustes = () => {

  const { logout } = useContext(AuthContext)

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [sincronizarLoading, setSincronizarLoading] = useState(false)
  const [expanded, setExpanded] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState(false);

  const [checkOpcionDesplazamiento, setCheckOpcionDesplazamiento] = useState()
  const [checkOpcionIncidente, setCheckOpcionIncidente] = useState()
  const [checkOpcionMarcador, setCheckOpcionMarcador] = useState()
  const [checkOpcionContador, setCheckOpcionContador] = useState()

  const [fecha] = useState(format(new Date(), 'yyyy'))

  const { isConnected } = useContext(NetworkContext)

  const cerrarSesion = () => {
    setLoading(true);
    logout();
  }

  const sincronizarCatalogos = () => {
    setSincronizarLoading(true);
    setTimeout(() => {
      setSincronizarLoading(false);
    }, 2000);
  };

  const sincronizarDesplazamiento = async (value) => {
    const estado = value ? 'activo' : 'inactivo'
    await AsyncStorage.setItem('opcion-desplazamiento', estado)
    setCheckOpcionDesplazamiento(value)
  }

  const sincronizarIncidente = async (value) => {
    const estado = value ? 'activo' : 'inactivo'
    await AsyncStorage.setItem('opcion-incidente', estado)
    setCheckOpcionIncidente(value)
  }

  const sincronizarMarcador = async (value) => {
    const estado = value ? 'activo' : 'inactivo'
    await AsyncStorage.setItem('opcion-marcador', estado)
    setCheckOpcionMarcador(value)
  }

  const sincronizarContador = async (value) => {
    const estado = value ? 'activo' : 'inactivo'
    await AsyncStorage.setItem('opcion-contador', estado)
    setCheckOpcionContador(value)
  }

  const getEstadoOpciones = async () => {
    const desplazamiento = await AsyncStorage.getItem('opcion-desplazamiento');
    desplazamiento === 'activo' ? setCheckOpcionDesplazamiento(true) : setCheckOpcionDesplazamiento(false)

    const incidente = await AsyncStorage.getItem('opcion-incidente');
    incidente === 'activo' ? setCheckOpcionIncidente(true) : setCheckOpcionIncidente(false)

    const marcador = await AsyncStorage.getItem('opcion-marcador');
    marcador === 'activo' ? setCheckOpcionMarcador(true) : setCheckOpcionMarcador(false)

    const contador = await AsyncStorage.getItem('opcion-contador');
    contador === 'activo' ? setCheckOpcionContador(true) : setCheckOpcionContador(false)
  }

  useEffect(() => {
    getEstadoOpciones();
  }, [])


  const SincronizarList = () => {
    return (
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title>Sincronizar</ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <ListItem
          Component={TouchableHighlight}
          onPress={sincronizarCatalogos}
        >
          <ListItem.Content>

            <ListItem.Title>Sincronizar catalogos</ListItem.Title>
            <ListItem.Subtitle>Toca para actualizar</ListItem.Subtitle>
          </ListItem.Content>
          {
            sincronizarLoading ? (
              <ActivityIndicator size="small" color={primary} />
            ) : (
              <Icon
                type="material-community"
                name={'cloud-download'}
                color={'grey'}
              />
            )
          }

        </ListItem>
      </ListItem.Accordion>
    )
  }


  const OpcionDesplazamiento = useCallback(
    () => {
      return (
        <ListItem>
          <Icon name='run' type='material-community' color='grey' />
          <ListItem.Content>
            <ListItem.Title>Envió automático de registros de desplazamientos</ListItem.Title>
          </ListItem.Content>
          <Switch
            trackColor={{ false: '#d8d8db', true: '#d8d8db' }}
            thumbColor={checkOpcionDesplazamiento ? primary : '#f4f3f4'}
            value={checkOpcionDesplazamiento}
            onValueChange={(value) => sincronizarDesplazamiento(value)}
          />

        </ListItem>
      )
    },
    [checkOpcionDesplazamiento],
  )

  const OpcionIncidente = useCallback(
    () => {
      return (
        <ListItem>
          <Icon name='car-cog' type='material-community' color='grey' />

          <ListItem.Content>
            <ListItem.Title>Envió automático de registros de incidentes</ListItem.Title>
          </ListItem.Content>
          <Switch
            trackColor={{ false: '#d8d8db', true: '#d8d8db' }}
            thumbColor={checkOpcionIncidente ? primary : '#f4f3f4'}
            value={checkOpcionIncidente}
            onValueChange={(value) => sincronizarIncidente(value)}
          />

        </ListItem>
      )
    },
    [checkOpcionIncidente],
  )

  const OpcionMarcador = () => {
    return (
      <ListItem>
        <Icon name='traffic-light' type='material-community' color='grey' />

        <ListItem.Content>
          <ListItem.Title>Envió automático de registros de marcadores</ListItem.Title>
        </ListItem.Content>
        <Switch
          trackColor={{ false: '#d8d8db', true: '#d8d8db' }}
          thumbColor={checkOpcionMarcador ? primary : '#f4f3f4'}
          value={checkOpcionMarcador}
          onValueChange={(value) => sincronizarMarcador(value)}
        />

      </ListItem>
    )
  }
  const OpcionContador = () => {
    return (
      <ListItem>
        <Icon name='car-3-plus' type='material-community' color='grey' />
        <ListItem.Content>
          <ListItem.Title>Envió automático de registros de Contadores</ListItem.Title>
        </ListItem.Content>
        <Switch
          trackColor={{ false: '#d8d8db', true: '#d8d8db' }}
          thumbColor={checkOpcionContador ? primary : '#f4f3f4'}
          value={checkOpcionContador}
          onValueChange={(value) => sincronizarContador(value)}
        />

      </ListItem>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1, width: '100%'}}>
      <ScrollView >
        <View >
          <Modal
            animationType="fade"
            visible={modalVisible}
            transparent={true}
            statusBarTranslucent={true}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{ ...styles.titleText, color: primary, fontSize: 20, fontWeight: 'bold' }}>¿Seguro de cerrar sesión?</Text>
                <Text style={{ ...styles.titleText, color: 'gray', fontSize: 14, fontWeight: 'normal' }}>Cualquier registros no sincronizado se perderá</Text>
                <View style={{
                  flexDirection: 'row'
                }}>
                  {
                    loading ? (
                      <ActivityIndicator size="large" color={primary} />
                    ) : (
                      <>
                        <Button title="Sí, seguro" type="clear" titleStyle={{ color: primary }} onPress={() => { cerrarSesion() }} />
                        <Button title="Cancelar" type="clear" titleStyle={{ color: 'gray' }} onPress={() => { setModalVisible(!modalVisible) }} />
                      </>
                    )
                  }
                </View>
              </View>
            </View>
          </Modal>
          <SincronizarList />
          <OpcionDesplazamiento />
          <OpcionIncidente />
          <OpcionMarcador />
          <OpcionContador />
        </View>
      </ScrollView>
        <View style={styles.foobar}>
          <Button
            title="Cerrar sesión"
            type="clear"
            onPress={() => { setModalVisible(true) }}
            titleStyle={{fontSize: 20, color: primary}}
            icon={
              <Icon
                name="logout"
                type="material-community"
                size={20}
                color={primary}
              />
            }
            iconRight
          />
          <View style={{ marginTop: 10, justifyContent: 'center', alignContent: 'center' }}>

            <Text style={{...styles.text, color:'grey'}}>© {fecha} Universidad de El Salvador.</Text>
            <Text style={{...styles.text, color:'grey'}}>Todos los derechos reservados</Text>
          </View>

        </View>


    </View>
  )
}

const stylesAjustes = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});