import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../pages/Home';
import { MapPage } from '../pages/MapPage';
import { Permission } from '../pages/Permission';
import { PermissionContext } from '../context/PermissionContext';
import { Loading } from '../components/Loading';

const Stack = createNativeStackNavigator();

const style = {
    headerShown: false,
    cardStyle: {
        backgroundColor: 'blue',
    }
}

export const Navigation = () => {

    const { permissions, checkLocationPermission } = useContext(PermissionContext);
    checkLocationPermission();
    if (permissions.locationStatus === 'unavailable'){
        return <Loading/>;
    }

  return (
      <Stack.Navigator
            screenOptions={style} 
       >

        {
            (permissions.locationStatus === 'granted')
             ? <Stack.Screen name='Home' component={Home} />
             : <Stack.Screen name="Permission" component={Permission} />
        }

          <Stack.Screen name="MapPage" component={MapPage} />
      </Stack.Navigator>
  )
}
