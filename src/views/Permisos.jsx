import React, { useContext } from 'react'
import { Image, ImageBackground, Linking, Text, View } from 'react-native'
import { PermissionContext } from '../context/permissions/PermissionContext';
import { Badge, Button } from '@rneui/base'
import { Loading } from '../components/Loading';
import { styles } from '../styles/style';
import { useCallback } from 'react';
import { NavigationContext } from '@react-navigation/native';

export const Permisos = () => {
  const { permissions, askLocationPermissions, denyLocationPermissions } = useContext(PermissionContext)
  const navigation = useContext(NavigationContext)


  if (permissions.locationStatus === 'unavailable') {
    return <Loading />;
  }

  const OpenSettingsButton = ({ children }) => {
    const handlePress = useCallback(async () => {
      await Linking.openSettings();
    }, []);

    return <Button title={children}
      onPress={handlePress}
      buttonStyle={styles.buttonPrimary}
      containerStyle={styles.buttonContainer}
    />;
  };

  const respuestaPermiso = async () => {
    const respuesta = await askLocationPermissions()
    if (respuesta) navigation.navigate('PermisosBackground')
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../img/loginBackground.jpg')} resizeMode="cover" style={{
        flex: 1,
        justifyContent: 'center',
      }}>
        <View style={styles.body}>
          <Image
            source={require('../img/permiso/map-pointer.png')}
            style={{ ...styles.image, width: '50%', height: '50%' }}
          />
          <Text style={styles.titleText}>
            Habilitar ubicación
          </Text>
          <Text style={styles.text}>
            Registracker captura la ubicación del dispositivo con el objetivo de registrar los desplazamientos realizados por el usuario mientras la app no esté en uso.
          </Text>
        </View>
        <View style={[styles.foobar, styles.row, { justifyContent: 'space-around' }]} >
          <Button
            // onPress={() => navigation.navigate('')}
            onPress={() => denyLocationPermissions('locationStatus')}
            buttonStyle={styles.buttonSecondary}
            title='No, Gracias'
          />
          <View style={styles.row}>
            <Badge badgeStyle={{ marginHorizontal: 3 }} value="" status="success" />
            <Badge badgeStyle={{ marginHorizontal: 3 }} value="" status="gray" />
          </View>
          {
            permissions.locationStatus !== 'never_ask_again'
              ? <Button
                title='Activar'
                onPress={respuestaPermiso}
                buttonStyle={styles.buttonPrimary}
                radius="lg"
              />
              : <OpenSettingsButton>Habilitar permisos</OpenSettingsButton>
          }
        </View>
      </ImageBackground>
    </View>
  )
}
