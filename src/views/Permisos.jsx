import React, { useContext } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { PermissionContext } from '../context/Permission/PermissionContext';
import { Card, Icon, Button } from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export const Permisos = () => {


    const { permissions, askLocationPermissions } = useContext( PermissionContext )
    console.log("🚀 ~ file: Permisos.jsx:9 ~ Permisos ~ permissions", permissions)
    

  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styleText.titleText}>
            Solicitud de permisos de GPS
        </Text>

      <Image
        source={require('../img/permiso/map-pointer.png')}
        style={styleText.image}
      />
          <Button 
            title='Permisos'
              onPress={askLocationPermissions} 
            />
            <Text>
              {JSON.stringify(permissions,  null, 5 )}
            </Text>

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
  image: {
    resizeMode: 'contain',
    height: 100,
    width: 200,
    marginVertical: 10,
  }
})
