import React, { useContext } from 'react'
import { Image, ImageBackground, Linking, Text, View } from 'react-native'
import { PermissionContext } from '../context/permissions/PermissionContext';
import { Button } from '@rneui/base'
import { Loading } from '../components/Loading';
import { styles } from '../styles/style';
import { useCallback } from 'react';

export const Permisos = () => {
  const { permissions, askLocationPermissions } = useContext(PermissionContext)

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
            Habilitar Geolocalización
          </Text>
          <Text style={styles.text}>
            Permitiendo la geolocalización podrás registrar tu recorrido, seleccionar tu medio de desplazamiento y otras funcionalidades.
          </Text>
        </View>
        <View style={styles.foobar} >
          {
            permissions.locationStatus !== 'never_ask_again'
              ? <Button
                title='Permitir geolocalización'
                onPress={askLocationPermissions}
                buttonStyle={styles.buttonPrimary}
                containerStyle={styles.buttonContainer}
                radius="lg"
              />
              : <OpenSettingsButton>Habilitar permisos</OpenSettingsButton>
          }
        </View>
      </ImageBackground>
    </View>
  )
}
