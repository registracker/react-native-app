import React, { useContext, useEffect, useState, createRef } from 'react'
import { Alert, Image, Text, ToastAndroid, View } from 'react-native'
import { styles } from '../styles/style'
import { Button } from '@rneui/base'
import { AuthContext } from '../context/Auth/AuthContext'
import { Divider, Input } from '@rneui/themed';
import { register } from '../services/aurtenticacionServices';

export const FormularioRegistro = ({ route, navigation }) => {

    const { perfil } = route.params;

    const [email, setEmail] = useState()
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [passwordErrorMessage, setPasswordErrorMessage] = useState()
    const [emailErrorMessage, setEmailErrorMessage] = useState()
    const [formInvalid, setFormInvalid] = useState(true)
    const [cargando, setCargando] = useState(false)

    const inputPassword = createRef();
    const inputPasswordConfirm = createRef();
    const inputEmail = createRef();

    const registrar = async () => {

        const data = {
            email,
            password,
            rol: perfil.id
        }

        console.log(JSON.stringify(data, null, 3));
        try {
            setCargando(true)
            if (comparePassword()) {
                const { usuario, estado_cuenta } = await register(null, data);
                console.log("🚀 ~ file: FormularioRegistro.jsx:38 ~ registrar ~ estado_cuenta", estado_cuenta)
                if (estado_cuenta === 'En revisión') {
                    ToastAndroid.showWithGravity(
                        'Cuenta en revisión',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    );
                } else if ( estado_cuenta === 'Activa') {
                    ToastAndroid.showWithGravity(
                        'Cuenta en creada con exito',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                        );
                    }
                navigation.navigate('Login')
            } else {
                setPasswordErrorMessage("La contraseña no coinciden")
                inputPassword.current.focus();
                inputPassword.current.clear();
                inputPasswordConfirm.current.clear();
                setPassword()
            }

        } catch (error) {
            console.log("🚀 ~ file: Login.jsx:24 ~ registrar ~ error", error)
            ToastAndroid.showWithGravity(
                'Ha ocurrido un error interno',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        } finally {
            setCargando(false);
            cleanForm()
        }
    }

    const comparePassword = () => {
        if (password === passwordConfirm) {
            return true;
        } else {
            ToastAndroid.showWithGravity(
                'La contraseña no coinciden',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return false;
        }
    }


    const cleanForm = () => {
        setEmail(null);
        setPassword(null);
        setPasswordConfirm(null);
    }

    useEffect(() => {
        if (password !== passwordConfirm && passwordConfirm) {
            setPasswordErrorMessage("Las contraseña no coinciden")
            setFormInvalid(true);
        }
        if(!email && password && passwordConfirm){
            setEmailErrorMessage("Ingrese un correo electrónico")
            setFormInvalid(true);
        }
        if (password === passwordConfirm && email && email && passwordConfirm) {
            setPasswordErrorMessage()
            setEmailErrorMessage()
            setFormInvalid(false);
        }
    }, [passwordConfirm, password, email])



    return (
        <View style={styles.container}>
            <View style={{ ...styles.body, flex: 3 }}>
                <Image
                    style={{ ...styles.image, width: '80%', height: '80%' }}
                    source={require('../img/registro/apps.png')} />
                <Text style={styles.titleText}>Registro de usuario</Text>
            </View>
            <View style={{ ...styles.foobar, flex: 3 }} >

                <Input
                    onChangeText={setEmail}
                    value={email}
                    label="Correo electrónico"
                    labelStyle={{ marginLeft: 15 }}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    inputMode="email"
                    textAlign='center'
                    style={styles.input}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    ref={inputEmail}
                    errorMessage={emailErrorMessage}


                />
                <Input
                    onChangeText={setPassword}
                    value={password}
                    style={styles.input}
                    label="Contraseña"
                    labelStyle={{ marginLeft: 15, marginTop: 10 }}
                    textAlign='center'
                    placeholder="**********"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    secureTextEntry
                    enablesReturnKeyAutomatically
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    errorMessage={passwordErrorMessage}
                    errorStyle={{ marginLeft: 15 }}
                    ref={inputPassword}
                />

                <Input
                    onChangeText={setPasswordConfirm}
                    value={passwordConfirm}
                    style={styles.input}
                    label="Confirmar contraseña"
                    labelStyle={{ marginLeft: 15, marginTop: 10 }}
                    textAlign='center'
                    placeholder=" *********"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    secureTextEntry
                    enablesReturnKeyAutomatically
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    errorMessage={passwordErrorMessage}
                    errorStyle={{ marginLeft: 15 }}
                    ref={inputPasswordConfirm}

                />
                <Button
                    title="Registrarse"
                    onPress={registrar}
                    buttonStyle={styles.buttonPrimary}
                    disabledStyle={styles.buttonPrimaryDisabled}
                    loading={cargando}
                    disabled={formInvalid}
                    radius="lg"
                    containerStyle={styles.buttonContainer}
                />

            </View>
        </View>
    )
}
