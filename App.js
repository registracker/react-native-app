// In App.js in a new project
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PermissionsProvider} from './src/context/PermissionContext';
import {MenuLateral} from './src/navigation/MenuLateral';
import {createTable} from './src/config/database';

const AppState = ({children}) => {
  return <PermissionsProvider>{children}</PermissionsProvider>;
};

function App() {
  useEffect(() => {
    createTable;
  }, []);

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
