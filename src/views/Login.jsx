import React, { useContext, useEffect, useState } from 'react'
import { Alert, ImageBackground, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { styles } from '../styles/style'
import { Button } from '@rneui/base'
import { AuthContext } from '../context/Auth/AuthContext'
import { Input } from '@rneui/themed'

export const Login = () => {

  const [email, setEmail] = useState('developer@gmail.com')
  const [password, setPassword] = useState('password');
  const [cargando, setCargando] = useState(false)
  const { signIn, mensajeError, cleanError, autenticado } = useContext(AuthContext)
  const [emailErrorMessage, setEmailErrorMessage] = useState();


  if (autenticado === 'verificar') {
    return <Loading />;
  }

  const iniciarSesion = () => {
    try {
      setCargando(true)
      signIn({ email, password });

    } catch (error) {
      ToastAndroid.showWithGravity(
        'Ha ocurrido un error interno',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }

  const cleanForm = () => {
    setEmail(null);
    setPassword(null);
  }

  const isEmail = () => {
    const validRegex = /^[a-zA-Z0-9_]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)) {
      setEmailErrorMessage('Ingrese un correo electrónico valido');
      return false;
    } else {
      setEmailErrorMessage();
      return true;
    }
  };


  useEffect(() => {
    if (mensajeError.length === 0) return;
    Alert.alert(
      'Inicio de sesión incorrecto',
      mensajeError,
      [
        {
          text: 'Ok',
          onPress: () => {
            cleanError();
            cleanForm();
            setCargando(false);
          },
        }
      ]
    )
  }, [mensajeError])

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../img/loginBackground.jpg')} resizeMode="cover" style={styles.imageBackground}>
        <View style={styles.body} >
          <Text style={styles.titleText}>Iniciar sesión</Text>
          <Input
            onChangeText={setEmail}
            value={email}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            inputMode="email"
            textAlign='center'
            style={emailErrorMessage ? styles.inputError : styles.input}            onBlur={() => isEmail()}
            errorMessage={emailErrorMessage}
            errorStyle={emailErrorMessage ? stylesRegistro.errorStyle : null}
            label="Correo electrónico"
            labelStyle={{ color: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
          />
          <Input
            onChangeText={setPassword}
            value={password}
            style={styles.input}
            textAlign='center'
            placeholder="******"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            secureTextEntry
            enablesReturnKeyAutomatically
            label="Contraseña"
            labelStyle={{ color: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}

          />
          <Button
            title="Continuar"
            onPress={iniciarSesion}
            buttonStyle={styles.buttonPrimary}
            disabledStyle={styles.buttonPrimaryDisabled}
            loading={cargando}
            disabled={emailErrorMessage || cargando ? true : false}
            radius="lg"
            containerStyle={styles.buttonContainer}
          />
        </View>

      </ImageBackground>
    </View>
  )
}

const stylesRegistro = StyleSheet.create({
  errorStyle: {
    color: 'white',
    textAlign: 'center',
  },
});
