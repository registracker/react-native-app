import React from 'react'
import { Button, Platform, Text, View } from 'react-native'
import { check, PERMISSIONS, request } from 'react-native-permissions'

export const Permission = () => {

    let permissionsStatus = null;

    const checkLocationPermission = async () => {
        if (Platform.OS === 'android') {
            permissionsStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        console.log({ permissionsStatus });
    }

  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>
              Permisos
          </Text>
          <Button 
            title='Permisos'
            onPress={checkLocationPermission} 
            />
      </View>  
      )
}
