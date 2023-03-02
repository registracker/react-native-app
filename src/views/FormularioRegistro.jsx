import React, { useEffect, useState, createRef } from 'react'
import { ImageBackground, ScrollView, Text, ToastAndroid, TouchableHighlight, View } from 'react-native'
import { styles } from '../styles/style'
import { Button, Icon } from '@rneui/base'
import { Input } from '@rneui/themed';
import { register } from '../services/aurtenticacionServices';

export const FormularioRegistro = ({ route, navigation }) => {


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [passwordErrorMessage, setPasswordErrorMessage] = useState()
    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState()
    const [emailErrorMessage, setEmailErrorMessage] = useState()
    const [formInvalid, setFormInvalid] = useState(true)
    const [cargando, setCargando] = useState(false)
    const [rol, setRol] = useState()
    const [selectionRol, setSelectionRol] = useState(false)

    const inputPassword = createRef();
    const inputPasswordConfirm = createRef();
    const inputEmail = createRef();

    const investigador = { type: 'investigador', id: 3 }
    const participante = { type: 'participante', id: 2 }

    const registrar = async () => {

        const data = {
            email,
            password,
            rol: rol.id
        }

        try {
            setCargando(true)
            if (comparePassword()) {
                const { usuario, estado_cuenta } = await register(null, data);
                if (estado_cuenta === 'En revisión') {
                    ToastAndroid.showWithGravity(
                        'Cuenta en revisión',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    );
                } else if (estado_cuenta === 'Activa') {
                    ToastAndroid.showWithGravity(
                        'Cuenta en creada con exito',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                }
                navigation.navigate('Login')
            } else {
                inputPassword.current.focus();
                inputPassword.current.clear();
                inputPasswordConfirm.current.clear();
            }

        } catch (error) {
            console.error("🚀 ~ file: Login.jsx:24 ~ registrar ~ error", JSON.stringify(error.data.message))
            ToastAndroid.showWithGravity(
                `${error.data.message}`,
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

    const isEmail = () => {
        const validRegex = /^[a-zA-Z0-9_]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(validRegex)) {
            setEmailErrorMessage("Ingrese un correo electrónico valido")
            return false
        } else {
            setEmailErrorMessage()
            return true
        }
    }

    const selectRol = () => {
        if (rol) return true;
        setSelectionRol(true)
        return false;
    }

    /* 
        ^                         Start anchor
    (?=.*[A-Z])               Ensure string has one uppercase letters.
    (?=.*[!@#$&*])            Ensure string has one special case letter.
    (?=.*[0-9])               Ensure string has one digits.
    (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    .{8,}                      Ensure string is of length 8. Para cualquiera que quiera una longitud de al menos
    $                         End anchor.
    */
    const isPasswordSecure = () => {
        const validRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
        if (!password.match(validRegex)) {
            setFormInvalid(true);
            setPasswordErrorMessage("Ingrese un correo electrónico segura")
        } else {
            setPasswordErrorMessage()
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
            setPasswordConfirmErrorMessage("Las contraseña no coinciden")
            setFormInvalid(true);
        }
        if (password == passwordConfirm && passwordConfirm) {
            setPasswordErrorMessage("")
            setPasswordConfirmErrorMessage("")
            setFormInvalid(true);
        }
        if (!email && password && passwordConfirm) {
            setEmailErrorMessage("Ingrese un correo electrónico")
            setFormInvalid(true);
        }
        if (email) {
            if (isEmail()) {
                setFormInvalid(true);
            }
        }
        if (password === passwordConfirm && email && passwordConfirm && isEmail() && selectRol()) {
            setPasswordErrorMessage()
            setPasswordConfirmErrorMessage()
            setEmailErrorMessage()
            setFormInvalid(false);
        }
    }, [passwordConfirm, password, email, rol])

    useEffect(() => {
        if (rol) setSelectionRol(false)
    }, [rol])


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/loginBackground.jpg')} resizeMode="cover" style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <ScrollView>

                    <Text style={styles.titleText}>Registro de usuario</Text>
                    <View style={{ ...styles.body, flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableHighlight style={{
                            alignItems: 'center',
                            padding: 20,
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderRadius: 20,
                            width: 130,
                            height: 160,
                            backgroundColor: '#A31621',
                            paddingHorizontal: 0,
                            paddingTop: 0,
                            marginHorizontal: "5%",
                            marginBottom: 0,
                            borderColor: 'white',
                            borderWidth: rol?.id === 3 ? 2 : 0,

                        }}
                            onPress={() => setRol(investigador)}
                        >

                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon
                                    name='account-hard-hat'
                                    type='material-community'
                                    size={36}
                                    color='white'
                                />
                                <Text style={{
                                    color: 'white',
                                    fontSize: rol?.id === 3 ?20:16,
                                }}>
                                    Investigador
                                </Text>
                            </View>

                        </TouchableHighlight>
                        <TouchableHighlight style={{
                            alignItems: 'center',
                            padding: 20,
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderRadius: 20,
                            width: 130,
                            height: 160,
                            backgroundColor: '#111d4a',
                            borderColor: 'white',
                            borderWidth: rol?.id === 2 ? 2 : 0,
                            paddingTop: 0,
                            paddingHorizontal: 0,
                            marginHorizontal: "5%",
                            marginBottom: 0,
                        }}
                            onPress={() => setRol(participante)}
                        >
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} >
                                <Icon
                                    name='map-marker-distance'
                                    type='material-community'
                                    size={36}
                                    color='white'
                                />

                                <Text style={{
                                    color: 'white',
                                    fontSize: rol?.id === 2 ?20:16,
                                }}>
                                    Participante
                                </Text>
                            </View>


                        </TouchableHighlight>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        {
                            selectionRol && <Text style={{ color: 'white', fontSize: 12 }}>Debe seleccionar un rol</Text>
                        }
                    </View>
                    <View style={{ ...styles.foobar, flex: 3, marginTop: 10 }} >

                        <Input
                            onChangeText={setEmail}
                            value={email}
                            label="Correo electrónico"
                            placeholder="Correo electrónico"
                            keyboardType="email-address"
                            inputMode="email"
                            textAlign='center'
                            style={styles.input}
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                            ref={inputEmail}
                            errorMessage={emailErrorMessage}
                            onBlur={() => isEmail()}
                            labelStyle={{ marginTop: 10, color: 'white' }}
                            errorStyle={{ marginLeft: 15, color: 'white' }}


                        />
                        <Input
                            onChangeText={setPassword}
                            value={password}
                            style={styles.input}
                            label="Contraseña"
                            labelStyle={{ marginTop: 10, color:'white' }}
                            textAlign='center'
                            placeholder="**********"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="newPassword"
                            secureTextEntry
                            enablesReturnKeyAutomatically
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                            errorMessage={passwordErrorMessage}
                            errorStyle={{ marginLeft: 15, color: 'white' }}
                            ref={inputPassword}
                            onBlur={isPasswordSecure}

                        />

                        <Input
                            onChangeText={setPasswordConfirm}
                            value={passwordConfirm}
                            style={styles.input}
                            label="Confirmar contraseña"
                            labelStyle={{ marginTop: 10, color: 'white' }}
                            textAlign='center'
                            placeholder=" *********"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="newPassword"
                            secureTextEntry
                            enablesReturnKeyAutomatically
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                            errorMessage={passwordConfirmErrorMessage}
                            errorStyle={{ marginLeft: 15, color: 'white'}}
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
                </ScrollView>
            </ImageBackground>

        </View>
    )
}
