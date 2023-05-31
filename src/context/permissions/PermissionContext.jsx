import React, { createContext, useEffect, useRef, useState } from "react";
import { AppState, PermissionsAndroid } from "react-native";
import { showToast } from "../../utils/toast";

export const permissionsInitState = {
    locationStatus: 'unavailable',
    locationBackground: 'unavailable',
    intentos: 0,
}

export const PermissionContext = createContext({});

export const PermissionsProvider = ({ children }) => {

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [permissions, setPermissions] = useState(permissionsInitState)

    const askLocationPermissions = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                setPermissions({
                    ...permissions,
                    locationStatus: 'granted',
                    intentos: 0,

                })

            } else if (PermissionsAndroid.RESULTS.DENIED === granted) {
                setPermissions({
                    ...permissions,
                    locationStatus: 'denied',
                    intentos: permissions.intentos + 1,

                })
            } else if (PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN === granted) {
                if (permissions.intentos < 1) {
                    setPermissions({
                        ...permissions,
                        locationStatus: 'denied',
                        intentos: permissions.intentos + 1,
                    })
                } else {
                    setPermissions({
                        ...permissions,
                        locationStatus: 'never_ask_again',
                        intentos: 0,
                    })
                }

            }
        } catch (err) {
            showToast('Ocurrió un error al conceder los permisos')
        }


    }

    const askBackgroundLocations = async () => {
        try {
            const grantedBackground = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            )
            console.log("🚀 ~ file: PermissionContext.jsx:79 ~ askBackgroundLocations ~ grantedBackground:", grantedBackground)
            if (grantedBackground === PermissionsAndroid.RESULTS.GRANTED) {
                setPermissions({
                    ...permissions,
                    locationBackground: 'granted',
                })
            } if (PermissionsAndroid.RESULTS.DENIED === grantedBackground) {
                setPermissions({
                    ...permissions,
                    locationBackground: 'denied',
                    intentos: permissions.intentos + 1,

                })
            } else if (PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN === grantedBackground) {
                if (permissions.intentos < 1) {
                    setPermissions({
                        ...permissions,
                        locationBackground: 'denied',
                        intentos: permissions.intentos + 1,
                    })
                } else {
                    setPermissions({
                        ...permissions,
                        locationBackground: 'never_ask_again',
                        intentos: 0,
                    })
                }

            }
        } catch (error) {
            showToast('Ocurrió un error al conceder los permisos')
        }
    }

    const checkLocationPermission = async () => {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (granted) {
            const grantedBackground = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
            if (grantedBackground) {
                setPermissions({
                    ...permissions,
                    locationStatus: 'granted',
                    locationBackground: 'granted'
                });

            } else {

                setPermissions({
                    ...permissions,
                    locationStatus: 'granted',
                    locationBackground: 'denied'
                });
            }
        }
        else {
            setPermissions({
                ...permissions,
                locationStatus: 'denied',
                locationBackground: 'denied'
            });
        }
    }

    useEffect(() => {
        const subscription = AppState.addEventListener("change", state => {
            appState.current = state;
            setAppStateVisible(appState.current);
            if (appStateVisible === 'active') return;
            checkLocationPermission();
        });

        return () => {
            subscription.remove();
        };
    }, []);



    return (
        <PermissionContext.Provider value={{
            permissions,
            askLocationPermissions,
            askBackgroundLocations,
            checkLocationPermission
        }}>
            {children}
        </PermissionContext.Provider>
    )
}