import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home } from '../pages/Home';
import { MapPage } from '../pages/MapPage';
import { Navigation } from './Navigation';

const Drawer = createDrawerNavigator();

export const MenuLateral = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="StackNavigation" component={Navigation} />
            <Drawer.Screen name="MapPage" component={MapPage} />
        </Drawer.Navigator>
    );
}