// In App.js in a new project
import 'react-native-gesture-handler';

import React,{ useEffect }  from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Home} from './src/views/Home';
import {PermissionsProvider} from './src/context/Permission/PermissionContext';
import { createTable } from './src/config/database';

const AppState = ({children}) => {
  return <PermissionsProvider>{children}</PermissionsProvider>;
};

function App() {

  useEffect(() => {
    createTable('tbl_recorrido');
  }, []);


  return (
    <NavigationContainer>
      <AppState>
        <Home />
      </AppState>
    </NavigationContainer>
  );
}

export default App;
