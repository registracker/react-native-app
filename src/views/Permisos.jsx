import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { PermissionContext } from '../context/Permission/PermissionContext';
import { Card, Icon, Button } from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Loading } from '../components/Loading';
import { color } from 'react-native-reanimated';

export const Permisos = ({ navigation }) => {
  const { permissions, askLocationPermissions } = useContext(PermissionContext)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {

  }, [])

  if (permissions.locationStatus === 'unavailable') {
    return <Loading />;
  }

  if (permissions.locationStatus === 'never_ask_again') setBlocked(true);


  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center' }}>

        <Image
          source={require('../img/permiso/map-pointer.png')}
          style={styleText.image}
        />
        <Text style={styleText.titleText}>
          Habilitar Geolocalización
        </Text>
        <Text style={styleText.subtitleText}>
          Permitiendo la geolocalización podras registrar tu recorrido, seleccionar tu medio de desplazamiento y otras funcionalidades.
        </Text>
      </View>
      <View style={{ flex: 1, }} >


        {
          !blocked
            ? <Button
              
              title='Permitir geolocalización'
              onPress={askLocationPermissions}
            />
            : <Button
              title='GPS bloqueado'
              onPress={() => console.log("object")}
            />
        }
      </View>

    </View>
  )
}

const styleText = StyleSheet.create({
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    marginHorizontal: 20,
    color: 'gray',
  },
  image: {
    resizeMode: 'contain',
    height: 200,
    width: 400,
    marginVertical: 10,
  }
})
