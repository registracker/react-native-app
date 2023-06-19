import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '../../styles/style'
import { ImageBackground } from 'react-native'
import { Button, Icon, Image, Input } from '@rneui/base'
import { useState } from 'react'
import { ScrollView } from 'react-native'

export const ForgotPassword = () => {

    const [email, setEmail] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState()

    const isEmail = () => {
        const validRegex = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email) {

            if (!email.match(validRegex)) {
                setEmailErrorMessage('Correo electrónico invalido');
                return false;
            } else {
                setEmailErrorMessage('');
                return true;
            }
        }
    };


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../img/loginBackground.jpg')} resizeMode="cover" style={styles.imageBackground}>
                <ScrollView>
                    <View styles={styles.body}>
                        <View style={styles.center}>

                            <Image
                                style={{ ...styles.image, width: 250, height: 250 }}
                                source={require('../../img/proximamente/computer.png')} />
                        </View>
                        <Text style={styles.title}> Recuperar contraseña</Text>
                        <Text style={styles.text}> Ingresar el correo electrónico asociado a tu cuenta </Text>
                        <Input
                            onChangeText={setEmail}
                            value={email}
                            autoCapitalize='none'
                            placeholder={emailErrorMessage ? emailErrorMessage : "Correo electrónico"}
                            keyboardType="email-address"
                            inputMode="email"
                            textAlign='center'
                            style={styles.input}
                            onBlur={() => isEmail()}
                            errorMessage={emailErrorMessage}
                            leftIcon={emailErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                            errorStyle={emailErrorMessage ? styles.errorStyle : null}
                            label="Correo electrónico"
                            labelStyle={{ color: 'white' }}
                            inputContainerStyle={emailErrorMessage ? styles.inputContainerError : styles.inputContainer}
                            onFocus={() => { setEmailErrorMessage("") }}

                        />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            title='Enviar'
                            buttonStyle={styles.buttonPrimary}
                            containerStyle={styles.buttonContainer}
                            onPress={() => console.log('ForgotPassword')}
                            titleStyle={{ color: 'white' }}
                        />
                    </View>
                </ScrollView>

            </ImageBackground>
        </View>
    )
}

