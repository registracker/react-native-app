// In App.js in a new project
import 'react-native-gesture-handler';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PermissionsProvider} from './src/context/Permission/PermissionContext';
import {Navigation} from './src/navigation/Navigation';

function App() {
  return (
    <NavigationContainer>
      <PermissionsProvider>
        <Navigation />
      </PermissionsProvider>
    </NavigationContainer>
  );
}

export default App;
