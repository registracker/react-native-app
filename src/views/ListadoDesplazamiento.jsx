import React, { useState, useCallback, useEffect, useContext } from 'react'
import { FlatList, ImageBackground, ToastAndroid, View } from 'react-native'
import { Button, Icon, ListItem } from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { getDesplazamientos, removeDesplazamiento, sendDesplazamiento } from '../database/TblDesplazamientos'
import { postDesplazamiento } from '../services/desplazamientoServices'
import { Loading } from '../components/Loading'
import { styles } from '../styles/style';
import { SearchBar } from '@rneui/themed';
import { format } from 'date-fns';
import { NetworkContext } from '../context/network/NetworkContext';

export const ListadoDesplazamiento = () => {

  const [listadoDesplazamientos, setListadoDesplazamientos] = useState()
  const [cargando, setCargando] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const { isConnected } = useContext(NetworkContext)


  const updateSearch = (search) => {
    setSearch(search);
  };

  const searchText = async () => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const regexFecha = /^\d{2}-\d{2}-\d{4}$/;
    const desplazamientos = await getDesplazamientos();


    let result = null;
    if (regex.test(search)) {
      result = desplazamientos.filter(element => element.uuid === search)
    } else if (regexFecha.test(search)) {
      result = desplazamientos.filter(element => {
        const fecha = element.fecha_registro.split(" ")[0];
        if (fecha === search) {
          return element
        }
        return;
      })
    } else {
      setListadoDesplazamientos(desplazamientos)
    }
    setListadoDesplazamientos(result)
  }

  const items = async () => {
    const desplazamientos = await getDesplazamientos();
    setListadoDesplazamientos(desplazamientos)
  }

  const mostrarNotificacion = (mensaje) => {
    ToastAndroid.showWithGravity(
      mensaje,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  const deleteDesplazamiento = async (uuid, reset) => {
    const mensaje = 'Desplazamiento eliminado. ';
    try {
      await removeDesplazamiento(uuid)
      items();
      reset()
      mostrarNotificacion(mensaje)

    } catch (error) {
      reset()

    }
  }

  const enviarDesplazamiento = async (item, reset) => {
    setCargando(true)

    try {
      const data = {
        uuid: item.uuid,
        desplazamiento: JSON.parse(item.desplazamiento),
        costos: JSON.parse(item.costos)
      }
      await postDesplazamiento(data, true)
      items();
      reset()
    } catch (error) {
      reset()
    } finally {
      setCargando(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      items();
    }, [])
  );

  useEffect(() => {
    items();
  }, [])


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    items();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const ItemDesplazamiento = ({ item }) => (
    <ListItem.Swipeable
      leftContent={(reset) => (
        <Button
          title="Eliminar"
          onPress={() => deleteDesplazamiento(item.uuid, reset)}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
      )}
      rightContent={(reset) => (
        <>
          {
            isConnected ?
              item.enviado === 1 ?
                <Button
                  onPress={() => reset()}
                  icon={{ name: 'send-check', type: 'material-community', color: 'white' }}
                  loading={cargando}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                /> :
                <Button
                  title="Enviar"
                  onPress={() => enviarDesplazamiento(item, reset)}
                  icon={{ name: 'send', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                  loading={cargando}
                />
              : <Button
                title="Desconectado"
                onPress={() => reset()}
                icon={{ name: 'access-point-network-off', type: 'material-community', color: 'white' }}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'gray' }}
              />
          }
        </>
      )}
      containerStyle={{ backgroundColor: "white" }}
      topDivider={true}
    >
      <Icon name="run" type='material-community' />
      <ListItem.Content  >
        {/* <ListItem.Title>Registrado: {format(item.fecha_registro, 'dd-MM-yyyy hh:mm:ss aaaa')}</ListItem.Title> */}
        <ListItem.Title>Registrado: {item.fecha_registro}</ListItem.Title>
        <ListItem.Subtitle>{item.uuid}</ListItem.Subtitle>
      </ListItem.Content>

      <Icon
        type="material-community"
        name={item.enviado === 1 ? 'check-circle-outline' : 'cloud-upload'}
        color={item.enviado === 1 ? 'green' : 'grey'}
      />
    </ListItem.Swipeable>
  )


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/fondo.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
          tintColor: 'transparent'
        }}
      >
        <SearchBar
          placeholder="Buscar por identificador o fecha ..."
          onChangeText={updateSearch}
          value={search}
          lightTheme
          onBlur={searchText}
          onClear={items}
          // onKeyboardHide={searchText}
          autoCapitalize='none'
        />
        <FlatList
          data={listadoDesplazamientos}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={ItemDesplazamiento}
        />
      </ImageBackground>
    </View>
  )
}
