import React, { useContext, useEffect, useState } from 'react'
import { Alert, ImageBackground, Text, ToastAndroid, View } from 'react-native'
import { styles } from '../styles/style'
import { Button } from '@rneui/base'
import { AuthContext } from '../context/Auth/AuthContext'
import { Input } from '@rneui/themed'

export const Login = () => {

  const [email, setEmail] = useState('developer@gmail.com')
  const [password, setPassword] = useState('password');
  const [cargando, setCargando] = useState(false)
  const { signIn, mensajeError, cleanError, autenticado } = useContext(AuthContext)

  if (autenticado === 'verificar') {
    return <Loading />;
  }

  const iniciarSesion = () => {
    try {
      setCargando(true)
      signIn({ email, password });
      cleanForm()

    } catch (error) {
      ToastAndroid.showWithGravity(
        'Ha ocurrido un error interno',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setCargando(false)
    }
  }

  const cleanForm = () => {
    setEmail(null);
    setPassword(null);
  }

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
            style={styles.input}
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
            title="Iniciar sesión"
            onPress={iniciarSesion}
            buttonStyle={styles.buttonPrimary}
            disabledStyle={styles.buttonPrimaryDisabled}
            loading={cargando}
            disabled={cargando}
            radius="lg"
            containerStyle={styles.buttonContainer}
          />
        </View>

      </ImageBackground>
    </View>
  )
}
