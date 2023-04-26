/* eslint-disable prettier/prettier */
// In App.js in a new project
import 'react-native-gesture-handler';

import React from 'react';
import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';
import { PermissionsProvider } from './src/context/permissionsAndroid/PermissionContext';
import { Navigation } from './src/navigation/Navigation';
import { AuthProvider } from './src/context/authentication/AuthContext';
import { CatalogosProvider } from './src/context/Catalogos/CatalogosContext';

function App() {
  return (
    <NavigationContainer>
      <PermissionsProvider>
        <AuthProvider>
            <CatalogosProvider>
              <Navigation />
              <Toast />
            </CatalogosProvider>
        </AuthProvider>
      </PermissionsProvider>
    </NavigationContainer>
  );
}

export default App;
