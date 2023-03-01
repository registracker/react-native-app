/* eslint-disable prettier/prettier */
// In App.js in a new project
import 'react-native-gesture-handler';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PermissionsProvider} from './src/context/Permission/PermissionContext';
import {Navigation} from './src/navigation/Navigation';
import {AuthProvider} from './src/context/Auth/AuthContext';
import {RecorridosProvider} from './src/context/Recorrido/RecorridosContext';

function App() {
  return (
    <NavigationContainer>
      <PermissionsProvider>
        <AuthProvider>
          <RecorridosProvider>
            <Navigation />
          </RecorridosProvider>
        </AuthProvider>
      </PermissionsProvider>
    </NavigationContainer>
  );
}

export default App;
