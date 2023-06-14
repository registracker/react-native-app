import { View, Text, ImageBackground, Image, Linking } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { styles } from '../styles/style'
import { Badge, Button } from '@rneui/base'
import { PermissionContext } from '../context/permissions/PermissionContext'

export const PermisosBackground = ({navigation}) => {

    const { permissions, askBackgroundLocations } = useContext(PermissionContext)

    const OpenSettingsButton = ({ children }) => {
        const handlePress = useCallback(async () => {
            await Linking.openSettings();
        }, []);

        return <Button
            title='Abrir ajustes'
            onPress={handlePress}
            buttonStyle={styles.buttonSecondary}
            containerStyle={styles.buttonContainer}
            radius="lg"
        />
    };


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/background.jpg')} resizeMode="cover" style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <View style={styles.body}>
                    <Image
                        source={require('../img/permiso/settings.png')}
                        style={{ ...styles.image, width: '50%', height: '50%' }}
                    />
                    <Text style={styles.titleText}>
                        Habilitar ubicación en segundo plano.
                    </Text>
                    <Text style={styles.text}>
                        Registracker utilizara los permisos de ubicación en segundo plano cuando la app esté cerrada con el objetivo de registrar la ubicación del usuario aun cuando la app no está en uso.
                    </Text>
                    {/* <Text
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 12,
                            textDecorationLine: 'underline',
                            marginTop: 10
                        }}
                        onPress={() => navigation.navigate('TerminosCondiciones')}
                    >
                        Términos y condiciones
                    </Text> */}
                </View>
                <View style={[styles.foobar, styles.row, { justifyContent: 'space-around' }]} >
                    <Button
                        // onPress={() => navigation.navigate('')}
                        onPress={() => denyLocationPermissions('locationBackground')}
                        buttonStyle={styles.buttonSecondary}
                        title='No, Gracias'
                    />
                    <View style={styles.row}>
                        <Badge badgeStyle={{ marginHorizontal: 3 }} value="" status="gray" />
                        <Badge badgeStyle={{ marginHorizontal: 3 }} value="" status="success" />
                    </View>
                    {
                        permissions.locationBackground !== 'never_ask_again'
                            ? <Button
                                title='Activar'
                                onPress={askBackgroundLocations}
                                buttonStyle={styles.buttonPrimary}
                                // containerStyle={styles.buttonContainer}
                                radius="lg"
                            />
                            : <OpenSettingsButton>Habilitar permisos</OpenSettingsButton>
                    }
                </View>
            </ImageBackground>
        </View>
    )
}

