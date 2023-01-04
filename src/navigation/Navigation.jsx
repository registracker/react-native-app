import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../pages/Home';
import { MapPage } from '../pages/MapPage';
import { Permission } from '../pages/Permission';

const Stack = createNativeStackNavigator();

const style = {
    headerShown: false,
    cardStyle: {
        backgroundColor: 'blue',
    }
}

export const Navigation = () => {
  return (
      <Stack.Navigator
            initialRouteName='Permission'
            screenOptions={style} 
       >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MapPage" component={MapPage} />
          <Stack.Screen name="Permission" component={Permission} />
      </Stack.Navigator>
  )
}
