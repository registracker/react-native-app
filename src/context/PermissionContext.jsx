import { createContext, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { check, openSettings, PERMISSIONS, request } from "react-native-permissions";


// export interface PermissionState {
//     locationStatus;
// }

export const permissionsInitState = {
    locationStatus: 'unavailable'
}

export const PermissionContext = createContext({});

export const PermissionsProvider = ({ children }) => {

    const [permissions, setPermissions] = useState(permissionsInitState)

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", state => {
            appState.current = state;
            setAppStateVisible(appState.current);
            console.log(appState.current);
            if (appStateVisible === 'active') return;
            checkLocationPermission();
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const askLocationPermissions = async () => {
        let permissionsStatus = null;
        permissionsStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (permissionsStatus === 'blocked') openSettings();
        setPermissions({
            ...permissions,
            locationStatus: permissionsStatus
        })
    }

    const checkLocationPermission = async () => {
        let permissionStatus;

        if (Platform.OS === 'ios') {
            permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
            permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        });
    }

    return (
        <PermissionContext.Provider value={{
            permissions,
            askLocationPermissions,
            checkLocationPermission
        }}>
            {children}
        </PermissionContext.Provider>
    )
}