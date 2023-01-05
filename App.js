// In App.js in a new project
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Navigation} from './src/navigation/Navigation';
import {PermissionsProvider} from './src/context/PermissionContext';

const AppState = ({children}) => {
  return <PermissionsProvider>{children}</PermissionsProvider>;
};

function App() {
  return (
    <NavigationContainer>
      <AppState>
        <Navigation />
      </AppState>
    </NavigationContainer>
  );
}

export default App;
