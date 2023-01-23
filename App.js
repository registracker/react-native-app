// In App.js in a new project
import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Navigation} from './src/navigation/Navigation';
import {PermissionsProvider} from './src/context/PermissionContext';
import {MenuLateral} from './src/navigation/MenuLateral';

const AppState = ({children}) => {
  return <PermissionsProvider>{children}</PermissionsProvider>;
};

function App() {
  return (
    <NavigationContainer>
      <AppState>
        {/* <Navigation /> */}
        <MenuLateral />
      </AppState>
    </NavigationContainer>
  );
}

export default App;
