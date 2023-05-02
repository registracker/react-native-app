import React, { useState, useCallback, useEffect } from 'react'
import { FlatList, ToastAndroid, View } from 'react-native'
import { Button, Icon, ListItem} from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { getDesplazamientos, removeDesplazamiento, sendDesplazamiento } from '../database/TblDesplazamientos'
import { postDesplazamiento } from '../services/desplazamientoServices'
import { Loading } from '../components/Loading'
import { styles } from '../styles/style';

export const ListadoDesplazamiento = () => {

  const [listadoDesplazamientos, setListadoDesplazamientos] = useState()
  const [cargando, setCargando] = useState(false)
  const [refreshing, setRefreshing] = useState(false);


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
    const mensaje = 'Desplazamiento enviado exitosamente.';

    try {
      setCargando(true)
      const data = {
        uuid: item.uuid,
        desplazamiento: JSON.parse(item.desplazamiento)
      }
      //Enviardo al backend
      await postDesplazamiento(data)
      //Actualizado en la base de datos local SQLITE
      await sendDesplazamiento(item.uuid, reset)
      items();
      reset()
      mostrarNotificacion(mensaje)
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


  if (!listadoDesplazamientos) return <Loading />


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
        <Button
          title="Enviar"
          onPress={() => enviarDesplazamiento(item, reset)}
          icon={{ name: 'send', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
          loading={cargando}
        />
      )}
      containerStyle={{ backgroundColor: "white" }}
      topDivider={true}
    >
      <Icon name="run" type='material-community' />
      <ListItem.Content  >
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
          <FlatList
            data={listadoDesplazamientos}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={ItemDesplazamiento}
          />
    </View>
  )
}
