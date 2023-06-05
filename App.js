/* eslint-disable prettier/prettier */
// In App.js in a new project
import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { PermissionsProvider } from './src/context/permissions/PermissionContext';
import { Navigation } from './src/menu/Navigation';
import { AuthProvider } from './src/context/authentication/AuthContext';
import { CatalogosProvider } from './src/context/store/CatalogosContext';
import { DesplazamientoProvider } from './src/context/tracking/DesplazamientoContext';
import { MarcadorProvider } from './src/context/levantamiento/MarcadorContext';
import { NetworkProvider } from './src/context/network/NetworkContext';
import { ContadorProvider } from './src/context/levantamiento/ContadorContext';
import { IncidenteProvider } from './src/context/levantamiento/IncidenteContext';
import { BitacoraProvider } from './src/context/bitacora/BitacoraContext';

function App() {
  return (
    <NavigationContainer>
      <PermissionsProvider>
        <NetworkProvider>

          <AuthProvider>
            <BitacoraProvider>
              <CatalogosProvider>
                <DesplazamientoProvider>
                  <IncidenteProvider>
                    <MarcadorProvider>
                      <ContadorProvider>
                        <Navigation />
                      </ContadorProvider>
                    </MarcadorProvider>
                  </IncidenteProvider>
                </DesplazamientoProvider>
              </CatalogosProvider>
            </BitacoraProvider>
          </AuthProvider>
        </NetworkProvider>

      </PermissionsProvider>
    </NavigationContainer>
  );
}

export default App;
