import { View, Text, ImageBackground, Image, Linking } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { styles } from '../styles/style'
import { Button } from '@rneui/base'
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
                        Habilitar registro de desplazamiento en segundo plano
                    </Text>
                    <Text style={styles.subtitleText}>
                        Respetamos tu privacidad. Tus datos se recolectaran con precisión y confidencialidad para mejorar tu experiencia.
                    </Text>
                    <Text style={styles.text}>
                        Selecciona permitir todo el tiempo
                    </Text>
                    <Text
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
                    </Text>
                </View>
                <View style={styles.foobar} >
                    
                    {
                        permissions.locationBackground !== 'never_ask_again'
                            ? <Button
                                title='Permitir en segundo plano'
                                onPress={askBackgroundLocations}
                                buttonStyle={styles.buttonPrimary}
                                containerStyle={styles.buttonContainer}
                                radius="lg"
                            />
                            : <OpenSettingsButton>Habilitar permisos</OpenSettingsButton>
                    }
                </View>
            </ImageBackground>
        </View>
    )
}

